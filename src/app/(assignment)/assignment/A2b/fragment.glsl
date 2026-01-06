/////////////////////////////////////////////////////
//// CS 8803/4803 CGAI: Computer Graphics in AI Era
//// Assignment 1B: Neural SDF
/////////////////////////////////////////////////////

precision highp float;              //// set default precision of float variables to high precision

varying vec2 vUv;                   //// screen uv coordinates (varying, from vertex shader)
uniform vec2 iResolution;           //// screen resolution (uniform, from CPU)
uniform float iTime;                //// time elapsed (uniform, from CPU)

#define PI 3.1415925359

const vec3 CAM_POS = vec3(0, 1, 0);

vec3 rotate(vec3 p, vec3 ax, float ro)
{
    return mix(dot(p, ax) * ax, p, cos(ro)) + sin(ro) * cross(ax, p);
}

/////////////////////////////////////////////////////
//// sdf functions
/////////////////////////////////////////////////////

float sdfPlane(vec3 p, float h)
{
    return p.y - h;
}

float sdfBunny(vec3 p)
{
    p = rotate(p, vec3(1., 0., 0.), PI / 2.);
    p = rotate(p, vec3(0., 0., 1.), PI / 2. + PI / 1.);

    // sdf is undefined outside the unit sphere, uncomment to witness the abominations
    if(length(p) > 1.0)
    {
        return length(p) - 0.9;
    }

    //// neural network weights for the bunny 

    vec4 f0_0=sin(p.y*vec4(1.74,-2.67,1.91,-1.93)+p.z*vec4(2.15,-3.05,.50,-1.32)+p.x*vec4(2.47,.30,-2.00,-2.75)+vec4(1.31,6.89,-8.25,.15));
    vec4 f0_1=sin(p.y*vec4(-.72,-3.13,4.36,-3.50)+p.z*vec4(3.39,3.58,-4.52,-1.10)+p.x*vec4(-1.02,-2.90,2.23,-.62)+vec4(1.61,-.84,-2.00,-.47));
    vec4 f0_2=sin(p.y*vec4(-1.47,.32,-.70,-1.51)+p.z*vec4(.17,.75,3.59,4.05)+p.x*vec4(-3.10,1.40,4.72,2.90)+vec4(-6.76,-6.43,2.41,-.66));
    vec4 f0_3=sin(p.y*vec4(-2.75,1.59,3.43,-3.39)+p.z*vec4(4.09,4.09,-2.34,1.23)+p.x*vec4(1.07,.65,-.18,-3.46)+vec4(-5.09,.73,3.06,3.35));
    vec4 f1_0=sin(mat4(.47,.12,-.23,-.04,.48,.06,-.24,.19,.12,.72,-.08,.39,.37,-.14,-.01,.06)*f0_0+
        mat4(-.62,-.40,-.81,-.30,-.34,.08,.26,.37,-.16,.38,-.09,.36,.02,-.50,.34,-.38)*f0_1+
        mat4(-.26,-.51,-.32,.32,-.67,.35,-.43,.93,.12,.34,.07,-.01,.67,.27,.43,-.02)*f0_2+
        mat4(.02,-.18,-.15,-.10,.47,-.07,.82,-.46,.18,.44,.39,-.94,-.20,-.28,-.20,.29)*f0_3+
        vec4(-.09,-3.49,2.17,-1.45))/1.0+f0_0;
    vec4 f1_1=sin(mat4(-.46,-.33,-.85,-.57,.41,.87,.25,.58,-.47,.16,-.14,-.06,-.70,-.82,-.20,.47)*f0_0+
        mat4(-.15,-.73,-.46,-.58,-.54,-.34,-.02,.12,.55,.32,.22,-.87,-.57,-.28,-.51,.10)*f0_1+
        mat4(.75,1.06,-.08,-.17,-.43,.69,1.07,.23,.46,-.02,.10,-.11,.21,-.70,-.08,-.48)*f0_2+
        mat4(.04,-.09,-.51,-.06,1.12,-.21,-.35,-.17,-.95,.49,.22,.99,.62,-.25,.06,-.20)*f0_3+
        vec4(-.61,2.91,-.17,.71))/1.0+f0_1;
    vec4 f1_2=sin(mat4(.01,-.86,-.07,.46,.73,-.28,.83,.12,.16,.33,.28,-.55,-.21,-.02,.53,-.15)*f0_0+
        mat4(-.28,-.32,.19,-.28,.24,-.23,-.61,-.39,.26,.40,.18,.41,.21,.57,-.91,-.29)*f0_1+
        mat4(.23,-.40,-1.34,-.50,.08,-.04,-1.67,-.16,-.65,-.09,.38,-.22,-.14,-.34,.37,.05)*f0_2+
        mat4(-.47,-.23,-.57,-.05,.51,.04,.00,.27,.80,.29,-.09,-.53,-.20,-.41,-.64,-.12)*f0_3+
        vec4(1.08,4.00,-2.54,2.18))/1.0+f0_2;
    vec4 f1_3=sin(mat4(-.30,.38,.39,.53,.73,.73,-.06,.01,.54,-.07,-.19,.68,.59,.40,.04,.07)*f0_0+
        mat4(-.17,.44,-.61,.43,-.84,-.12,.65,-.50,.33,-.31,-.28,.13,.18,-.42,.14,.08)*f0_1+
        mat4(-.78,.06,-.18,.37,-.99,.49,.71,.15,.27,-.48,-.17,.25,.05,.10,-.40,-.21)*f0_2+
        mat4(-.17,-.27,.40,.18,-.24,.23,.03,-.83,-.30,-.38,.07,.21,-.45,-.24,.78,.50)*f0_3+
        vec4(2.14,-3.48,3.81,-1.43))/1.0+f0_3;
    vec4 f2_0=sin(mat4(.83,.15,-.49,-.80,-.83,.16,1.24,.75,-.27,.18,-.13,1.05,.70,-.15,.30,.79)*f1_0+
        mat4(-.38,-.17,.34,.67,-.39,.09,.48,-.93,.19,.60,-.20,-.22,-.76,-.62,-.40,.01)*f1_1+
        mat4(.10,.22,.08,.13,-.42,-.11,.71,-.63,.02,.46,-.07,-.46,-.37,.07,.15,.14)*f1_2+
        mat4(.09,-.48,-.38,.40,-.57,-.88,-.14,-.25,.20,.95,.86,-1.08,.46,.04,.53,-.82)*f1_3+
        vec4(3.47,-3.66,3.06,.84))/1.4+f1_0;
    vec4 f2_1=sin(mat4(1.03,.03,-.76,-.03,.84,.66,-.49,.74,-.09,-.85,-.55,.17,.07,.85,-.55,-.20)*f1_0+
        mat4(-.55,1.13,.41,-.21,-.55,.19,.49,.67,.40,1.80,-.82,-.83,-1.02,.78,-.42,-.51)*f1_1+
        mat4(.77,-.88,.64,1.10,-.49,1.05,-.43,-.38,.66,-.63,.02,.11,-.24,-.23,.49,-.65)*f1_2+
        mat4(-.66,1.90,.02,-.48,.22,-.62,-.68,-.44,.52,-.57,.16,-.61,-.03,-.02,-.88,-.23)*f1_3+
        vec4(.58,-3.00,-2.53,.14))/1.4+f1_1;
    vec4 f2_2=sin(mat4(-.44,-.06,.30,-.37,.27,-.23,-.56,.15,.03,-.14,-.08,.72,.76,-.58,.55,.29)*f1_0+
        mat4(.31,.23,.42,-.17,.37,-.05,.39,.46,-1.14,.32,.06,-.28,.28,-.21,-.58,.62)*f1_1+
        mat4(.92,-.16,.86,-.09,-.12,.33,-.49,-.24,.29,-.19,.95,-.40,-.87,.08,.08,-.71)*f1_2+
        mat4(-.45,.67,1.07,-.14,-.56,.06,-.81,-.15,-.57,-.24,-1.09,.69,-.44,-.32,-.00,-.07)*f1_3+
        vec4(-4.43,-1.86,-2.87,1.45))/1.4+f1_2;
    vec4 f2_3=sin(mat4(.58,.25,.01,-.54,.34,.56,.61,-.79,-.01,.05,-.57,-1.31,.74,.78,-.10,-.11)*f1_0+
        mat4(-.03,-.48,-.24,.01,.10,.23,.22,-.05,.76,.29,-.37,.02,.54,-.07,.27,.38)*f1_1+
        mat4(.31,-1.03,.24,.95,.80,.29,.43,.61,-.04,-.22,-.06,-.52,-.46,.35,.07,-.07)*f1_2+
        mat4(.47,-.12,-.62,.06,.47,-.41,.53,-2.14,-.59,.16,.74,-.58,.32,.66,-.30,-.18)*f1_3+
        vec4(-2.86,-3.27,-.55,2.87))/1.4+f1_3;
    return dot(f2_0,vec4(-.08,.03,.07,-.03))+
        dot(f2_1,vec4(-.03,-.02,-.06,-.07))+
        dot(f2_2,vec4(.05,-.09,.03,.11))+
        dot(f2_3,vec4(.03,.06,-.06,-.03))+
        -0.014;
}

/////////////////////////////////////////////////////
//// Step 1: training a neural SDF model
//// You are asked to train your own neural SDF model on Colab. 
//// Your implementation should take place in neural_sdf.ipynb.
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//// Step 2: copy neural SDF weights to GLSL
//// In this step, you are asked to the network weights you have trained from the text file to the function sdfCow().
//// You should replace the default implementation (a sphere) with your own network weights. 
/////////////////////////////////////////////////////

float sdfCow(vec3 p)
{
    p = rotate(p, vec3(1., 0., 0.), PI / 2.);
    p = rotate(p, vec3(0., 0., 1.), PI / 3. + PI/3.0);

    // sdf is undefined outside the unit sphere, uncomment to witness the abominations
    if(length(p) > 1.)
    {
        return length(p) - 0.9;
    }

    //// your implementation starts

    //// your implementation ends
}

float sdfUnion(float d1, float d2)
{
    return min(d1, d2);
}

/////////////////////////////////////////////////////
//// Step 3: scene sdf
//// You are asked to use the sdf boolean operations to draw the bunny and the cow in the scene.
//// The bunny is located in the ceter of vec3(-1.0, 1., 4.), and the cow is located in the center of vec3(1.0, 1., 4.).
/////////////////////////////////////////////////////

//// sdf: p - query point
float sdf(vec3 p)
{
    float s = 0.;

    float plane_h = -0.1;

    //// calculate the sdf based on all objects in the scene

    //// your implementation starts

    //// your implementation ends

    return s;
}

/////////////////////////////////////////////////////
//// ray marching
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//// Step 4: ray marching
//// You are asked to implement the ray marching algorithm within the following for-loop.
//// You are allowed to reuse your previous implementation in A1a for this function.
/////////////////////////////////////////////////////

//// ray marching: origin - ray origin; dir - ray direction 
float rayMarching(vec3 origin, vec3 dir)
{
    float s = 0.0;

    //// your implementation starts

    //// your implementation ends

    return s;
}

/////////////////////////////////////////////////////
//// normal calculation
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//// Step 5: normal calculation
//// You are asked to calculate the sdf normal based on finite difference.
//// You are allowed to reuse your previous implementation in A1a for this function.
/////////////////////////////////////////////////////

//// normal: p - query point
vec3 normal(vec3 p)
{
    float s = sdf(p);          //// sdf value in p
    float dx = 0.01;           //// step size for finite difference

    //// your implementation starts

    //// your implementation ends

    return n;
}

/////////////////////////////////////////////////////
//// Phong shading
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//// Step 6: lighting and coloring
//// You are asked to specify the color for the two neural SDF objects in the scene.
//// Each object must have a separate color without mixing.
//// Notice that we have implemented the default Phong shading model for you.
/////////////////////////////////////////////////////

vec3 phong_shading(vec3 p, vec3 n)
{
    //// background
    if(p.z > 20.0)
    {
        vec3 color = vec3(0.04, 0.16, 0.33);
        return color;
    }

    //// phong shading
    vec3 lightPos = vec3(4. * sin(iTime), 4., 4. * cos(iTime));
    vec3 l = normalize(lightPos - p);
    float amb = 0.1;
    float dif = max(dot(n, l), 0.) * 0.7;
    vec3 eye = CAM_POS;
    float spec = pow(max(dot(reflect(-l, n), normalize(eye - p)), 0.0), 128.0) * 0.9;

    vec3 sunDir = normalize(vec3(0, 1, -1)); //// parallel light direction
    float sunDif = max(dot(n, sunDir), 0.) * 0.2;

    //// shadow
    float s = rayMarching(p + n * 0.02, l);
    if(s < length(lightPos - p))
        dif *= .2;

    vec3 color = vec3(1.0);

    //// your implementation starts
    
    //// your implementation ends

    return (amb + dif + spec + sunDif) * color;
}

/////////////////////////////////////////////////////
//// main function
/////////////////////////////////////////////////////

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy - .5 * iResolution.xy) / iResolution.y;         //// screen uv
    vec3 origin = CAM_POS;                                                  //// camera position 
    vec3 dir = normalize(vec3(uv.x, uv.y, 1));                              //// camera direction
    float s = rayMarching(origin, dir);                                     //// ray marching
    vec3 p = origin + dir * s;                                              //// ray-sdf intersection
    vec3 n = normal(p);                                                     //// sdf normal
    vec3 color = phong_shading(p, n);                                       //// phong shading
    fragColor = vec4(color, 1.);                                            //// fragment color
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}