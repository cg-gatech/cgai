uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float iPass;

varying vec2 vUv;

vec4 relu(vec4 x) {
    return max(x, 0.0);
}

// Paste serialized_model.txt here
vec2 queryNetwork(vec2 xt, float t) {
    // Replace this with your trained model by copying the content of serialized_model.txt
    return vec2(0.0);
}

// Gaussian noise functions
// Hash + gaussian noise (Box-Muller)
float hash1(float n) {
    return fract(sin(n) * 43758.5453);
}
vec2 gaussian2(float seed) {
    float u1 = max(hash1(seed), 1e-6);
    float u2 = hash1(seed + 19.19);
    float r = sqrt(-2.0 * log(u1));
    float a = 6.2831853 * u2;
    return r * vec2(cos(a), sin(a));
}
// Sample gaussian noise by particle index (for initialization)
vec2 randNoise2ByIndex(int i, float cycle) {
    return gaussian2(float(i) * 12.9898 + 78.233 + cycle * 101.357);
}
// Sample gaussian noise by particle state (for per-frame updates); salt avoids correlation between call sites
vec2 randNoise2ByState(vec2 pos, float t, float salt) {
    return gaussian2(dot(pos, vec2(12.9898, 78.233)) + t * 437.3 + iFrame * 13.7 + salt);
}

// Utilities
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Diffusion schedule
const int T = 400;
const float BETA_START = 1e-5;
const float BETA_END = 2e-3;
float beta(float t) {
    return BETA_START + (BETA_END - BETA_START) * t;
}
// Continuous approximation of alpha_bar for linear beta schedule:
float alphaBar(float t) {
    float bt = BETA_START;
    float bd = BETA_END - BETA_START;
    return exp(-float(T) * (bt * t + 0.5 * bd * t * t));
}

// Num of points
// Do not exceed PARTICLE_COUNT (100000) in page.tsx
const int N = 2000;
const int STEPS_PER_FRAME = 2;
const float EXTENT_T = 0.2;

bool isInitializing() {
    return iFrame < 2.0;
}

vec2 initParticle(int i, float cycle) {
    return randNoise2ByIndex(i, cycle);
}

vec2 reverseProcess(vec2 xt, float t, float t_prev) {
    // Gaussian noise
    vec2 z = randNoise2ByState(xt, t, 0.0);
    vec2 xt_prev = xt;

    // alphaBar() and beta() is provided
    // 1. Calculate alpha_t, alpha_bar_t, tilde_beta_t
    // 2. Predict noise: eps = queryNetwork(xt, t)
    // 3. Compute the reverse mean mu_theta using the formula from Step 5
    // 4. Sample x_{t-1} by adding noise scaled by sqrt(tilde_beta_t);
    //    skip noise injection at step 0.
    // Your implementation starts
    
    // Your implementation ends
    
    return clamp(xt_prev, vec2(-8.0), vec2(8.0));
}

vec2 forwardProcess(vec2 xt, float t, float t_next) {
    // Gaussian noise
    vec2 z = randNoise2ByState(xt, t, 1.0);
    vec2 x = xt;
    // beta() is provided
    // x_t = sqrt(1-beta_t)*x_{t-1} + sqrt(beta_t)*eps.
    // Your implementation starts
    
    // Your implementation ends

    return clamp(x, vec2(-8.0), vec2(8.0));
}

void advanceState(float t, float phase, float cycle, float resample, float dt, out float t_out, out float phase_out, out float cycle_out, out float resample_out) {
    t_out = t;
    phase_out = phase;
    cycle_out = cycle;

    for(int k = 0; k < STEPS_PER_FRAME; k++) {
        if(phase_out < 0.5) {
            t_out = t_out - dt;
            if(t_out <= -EXTENT_T) {
                // reverse -> forward
                phase_out = 1.0;
                t_out = 0.0;
                break;
            }
        } else {
            t_out = t_out + dt;
            if(t_out >= 1.0 + EXTENT_T) {
                // forward -> reverse
                phase_out = 0.0;
                t_out = 1.0;
                cycle_out = cycle + 1.0;
                resample_out = 1.0;
                break;
            }
        }
    }
}

vec2 screenCoordinate(vec2 fragCoord, float scale) {
    vec2 uv = (fragCoord / iResolution.xy) * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    return uv * scale;
}

int safeN(int simW, int simH) {
    return min(N, max(simW * simH - 1, 0));
}

ivec2 particleTexelIdx(int i, int simW) {
    int pidx = i + 1;
    return ivec2(pidx % simW, pidx / simW);
}

vec2 updateParticle(int i, int simW, float t, float phase, float cycle, float dt, float resample) {
    if(resample > 0.5) {
        return initParticle(i, cycle);
    }

    vec2 pos = texelFetch(iChannel0, particleTexelIdx(i, simW), 0).xy;
    float t_curr = t;
    float phase_curr = phase;

    for(int k = 0; k < STEPS_PER_FRAME; k++) {
        if(phase_curr < 0.5) {
            float t_next = t_curr - dt;
            // Freeze in [-EXTENT_T, 0.0], evolve only in [0.0, 1.0].
            if(t_next >= 0.0) {
                float t_dyn = clamp(t_curr, 0.0, 1.0);
                float t_next_dyn = clamp(t_next, 0.0, 1.0);
                pos = reverseProcess(pos, t_dyn, t_next_dyn);
            }
            t_curr = t_next;
            if(t_curr <= -EXTENT_T) {
                break;
            }
        } else {
            float t_next = t_curr + dt;
            // Freeze in [1.0, 1.0 + EXTENT_T], evolve only in [0.0, 1.0).
            if(t_next <= 1.0) {
                float t_dyn = clamp(t_curr, 0.0, 1.0);
                float t_next_dyn = clamp(t_next, 0.0, 1.0);
                pos = forwardProcess(pos, t_dyn, t_next_dyn);
            }
            t_curr = t_next;
            if(t_curr >= 1.0 + EXTENT_T) {
                break;
            }
        }
    }
    return pos;
}

void main() {
    // Pass 0: simulation into small buffer
    // Wirte to iChannel0
    if(iPass < 0.5) {
        vec2 pixel_ij = vUv * iResolution.xy;
        int pixel_i = int(pixel_ij.x);
        int pixel_j = int(pixel_ij.y);
        int simW = int(iResolution.x);
        int simH = int(iResolution.y);
        int activeN = safeN(simW, simH);
        int pidx = pixel_j * simW + pixel_i;

        float t = 1.0;
        // 0: reverse, 1: forward
        float phase = 0.0;
        float cycle = 0.0;
        float resample = 1.0;
        if(!isInitializing()) {
            vec4 s = texelFetch(iChannel0, ivec2(0, 0), 0);
            t = s.x;
            phase = s.y;
            cycle = s.z;
            resample = s.w;
        }

        float dt = 1.0 / float(T);

        // iChannel0 [1, N] stores particle information
        if(pidx > 0 && pidx <= activeN) {
            // Move particles
            int idx = pidx - 1;
            vec2 pos = updateParticle(idx, simW, t, phase, cycle, dt, resample);
            gl_FragColor = vec4(pos, 0.0, 1.0);
            return;
        // iChannel0 [0] stores state information
        } else if(pidx == 0) {
            // Write states
            float t_out = 1.0;
            float phase_out = 0.0;
            float cycle_out = 0.0;
            float resample_out = 0.0;

            advanceState(t, phase, cycle, resample, dt, t_out, phase_out, cycle_out, resample_out);

            gl_FragColor = vec4(t_out, phase_out, cycle_out, resample_out);
            return;
        }else{
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
    } else {
        // Pass 1: render full screen using sim buffer
        // Wirte to screen buffer
        ivec2 simSize = textureSize(iChannel0, 0);
        int simW = simSize.x;
        int simH = simSize.y;
        int activeN = safeN(simW, simH);
        vec4 state = texelFetch(iChannel0, ivec2(0, 0), 0);
        float t_out = state.x;
        vec2 uv = screenCoordinate(gl_FragCoord.xy, 2.5);
        vec3 col = vec3(0.05);

        for(int i = 0; i < N; i++) {
            if(i >= activeN) {
                break;
            }
            vec2 pos = texelFetch(iChannel0, particleTexelIdx(i, simW), 0).xy;
            float dist = length(uv - pos);
            float r = mix(0.02, 0.04, clamp(t_out, 0.0, 1.0));
            // Hard-edge circle
            float mask = 1.0 - step(r, dist);
            float fi = float(i) / float(max(activeN, 1));
            float hue = 0.10 + fi * 0.08;
            vec3 c = hsv2rgb(vec3(hue, 0.85, 1.0));
            col += mask * 0.18 * c;
        }

        col = 1.0 - exp(-col * 2.5);

        // Timeline bar
        float barH = 4.0;
        float barAlpha = step(gl_FragCoord.y, barH);
        float barFill = step(gl_FragCoord.x, t_out * iResolution.x);
        vec3 barColor = vec3(0.745, 0.694, 0.478);
        col = mix(col, barColor, barAlpha * barFill);

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
}
