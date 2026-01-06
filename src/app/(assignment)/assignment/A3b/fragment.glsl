
/////////////////////////////////////////////////////
//// CS 8803/4803 CGAI: Computer Graphics in AI Era
//// Assignment 2B: Neural Radiance Fields (NeRF)
/////////////////////////////////////////////////////

precision highp float;              //// set default precision of float variables to high precision

varying vec2 vUv;                   //// screen uv coordinates (varying, from vertex shader)
uniform vec2 iResolution;           //// screen resolution (uniform, from CPU)
uniform float iTime;                //// time elapsed (uniform, from CPU)

// ReLU function
vec4 relu(vec4 x)
{
    return max(x, vec4(0.0));
}

float relu(float x)
{
    return max(0.0, x);
}

// Sigmoid function
float sigmoid(float x)
{
    return 1.0 / (1.0 + exp(-x));
}

vec3 sigmoid(vec3 x)
{
    return 1.0 / (1.0 + exp(-x));
}

//// Replace this with the given hotdog NeRF model or your trained NeRF
vec4 queryNetwork(vec3 p){
    return vec4(0.0, 0.0, 0.0, 0.0);
}


vec3 rotate(vec3 p) {
    return vec3(p.x, -p.z, p.y);
}

//// set camera: ro - camera position, ta - camera lookat, cr - camera rotation angle
mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv =          ( cross(cu,cw) );
    return mat3( cu, cv, cw );
}
float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

/////////////////////////////////////////////////////
//// You are asked to implement the front-to-back volumetric ray tracing algorithm for NeRF to accummulate colors along each ray.
//// You may reuse most of the code from A2a, however, you would use your trained NeRF model to predict the RGB and sigma value.
//// To call your trained NeRF model, call queryNetwork(vec3 p)
//// We have given you a default hotdog model in hotdog.txt, replace that with your own NeRF.
//// Caution: After calling your NeRF, you should use Sigmoid for RGB and ReLU for sigma, as you do in your pytorch code.
//// Sigmoid and ReLU have been defined for you, simply call sigmoid() or relu().
/////////////////////////////////////////////////////

//// ro - ray origin, rd - ray direction, 
//// near - near bound of t, far - far bound of t, 
//// n_samples - number of samples between near and far
vec4 volumeRendering(vec3 ro, vec3 rd, float near, float far, int n_samples, vec2 fragCoord) 
{
    float stepSize = (far - near) / float(n_samples);                               //// step size of each sample

    //// color and transmittance
    vec3 color = vec3(0.0);                                                         //// accumulated color
    float transmittance = 1.0;                                                      //// transmittance

    //// ray marching loop
    for (int i = 0; i < n_samples; i++) {
        float t = near + stepSize * (float(i) + rand(fragCoord));                   //// t value along the ray
        vec3 p = ro + t * rd; // Compute 3D sample position

        //// your implementation starts


        //// your implementation ends

        //// early termination if opacity is high
        if (transmittance < 0.001) break;
    }
    
    //// return color and transmittance
    return vec4(color, 1.0);                                   
}



void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    //// normalize fragment coordinates to [-0.5, 0.5] range
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    //// camera 
    float angle = 0.5 * iTime;                                                  //// camera angle
    vec3 ta = vec3(0.0, 0.0, 0.0);                                              //// object center
    float radius = 3.5;                                                         //// camera rotation
    float height = 2.2;                                                         //// camera height
    vec3 ro = ta + vec3(radius * cos(angle), height, radius * sin(angle));      //// camera position
    mat3 ca = setCamera(ro, ta, 0.0);                                           //// camera matrix


    //// ray
    vec3 rd = ca * normalize(vec3(uv, 1.0));                                    //// ray direction
    float near = 2.0;                                                           //// near bound
    float far = 6.0;                                                            //// far bound
    int n_samples = 64;                                                         //// number of samples along each ray

    //// final output color
    fragColor = volumeRendering(ro, rd, near, far, n_samples, fragCoord);                  //// volumetric ray marching
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}