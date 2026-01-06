uniform float iTime;
uniform vec2 iResolution;

//======================================================= Copy-Paste Area Begin =========================================================
// Number of Gaussians
const int NUM_GAUSSIANS = 2;
// Dimensions [x_min, x_max, y_min, y_max]
float dim[4] = float[4](-5.0,5.0,-5.0,5.0);
// Centers (x, y coordinates)
vec2 gauss_centers[NUM_GAUSSIANS] = vec2[NUM_GAUSSIANS](vec2(-3.00, 1.50),vec2(1.50, 2.50));
// Sigmas (scales)
vec2 gauss_sigmas[NUM_GAUSSIANS] = vec2[NUM_GAUSSIANS](vec2(2.00, 1.50),vec2(1.50, 0.50));
// Rotation angles (thetas)
float gauss_thetas[NUM_GAUSSIANS] = float[NUM_GAUSSIANS](0.20,0.80);
// Colors (RGB)
vec3 gauss_colors[NUM_GAUSSIANS] = vec3[NUM_GAUSSIANS](vec3(0.70, 0.10, 0.20),vec3(0.30, 0.80, 0.10));

//======================================================= Copy-Paste Area End =========================================================

/////////////////////////////////////////////////////
//// Here, you are asked to build the inverse covariance matrix, similar to in the 2DGS_A3_solution.ipynb file.
//// You must create the rotation matrix R, the inverse squared sigma matrix D, and the final inverse covariance matrix. 
/////////////////////////////////////////////////////

// This function builds the inverse covariance matrix
mat2 buildSigmaInv(float theta, vec2 sigma)
{
    mat2 cov_mat = mat2(0, 0, 0, 0);

    /////////// 
    // BEGINNING OF YOUR CODE.
    //////////
    
    

    /////////// 
    // END OF YOUR CODE.
    //////////
    return cov_mat;
}

/////////////////////////////////////////////////////
//// Here, you are asked to fill in the necessary components for calculating each gaussian's contribution to the current pixel's color.
//// You must calculate the position of the pixel relative to the gaussian's center, calculate the contribution exponent (pos^T * sigma_inv * pos) 
//// and finally calculate the Gaussian function value that will control the contribution of this specific gaussian.
/////////////////////////////////////////////////////

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float aspect = (dim[1] - dim[0]) / (dim[3] - dim[2]) * iResolution.y / iResolution.x;
    vec2 uv = fragCoord.xy / iResolution.xy; // scale to [0, 1]
    // scale from [-1, 1] to [x_min, x_max] and [y_min, y_max]
    uv.x = mix(dim[0], dim[1], uv.x);
    uv.y = mix(dim[2], dim[3], uv.y);
    if (aspect > 1.0) {
        uv.y *= aspect;
    } else {
        uv.x /= aspect;
    }

    vec3 color = vec3(0.0);

    // Draw bounding box
    float edge = 0.01;
    if (uv.x > dim[0] - edge && uv.x < dim[0] + edge ||
        uv.x > dim[1] - edge && uv.x < dim[1] + edge ||
        ((uv.y > dim[2] - edge && uv.y < dim[2] + edge || uv.y > dim[3] - edge && uv.y < dim[3] + edge) && uv.x > dim[0] && uv.x < dim[1])) {
        color = vec3(1.0, 1.0, 1.0);
    }

    // Animate the Gaussian centers
    uv += smoothstep(0.0, 1.0, cos(iTime)) * cos(iTime + 100.0 * uv.xy) * 3.;

    for (int i = 0; i < NUM_GAUSSIANS; ++i) {
        vec2 center = gauss_centers[i];
        vec2 scale = gauss_sigmas[i];
        float theta = gauss_thetas[i];
        vec3 color_rgb = gauss_colors[i];
        
        // Build inverse covariance matrix
        mat2 sigma_inv = buildSigmaInv(theta, scale);
        float f_x = 0.;

        /////////// 
        // BEGINNING OF YOUR CODE.
        //////////
        

        /////////// 
        // END OF YOUR CODE.
        //////////
        
        // Add color contribution
        color += f_x * color_rgb;
    }

    fragColor = vec4(color, 1.0);
}


void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}