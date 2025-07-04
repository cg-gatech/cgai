// This tutorial code was implemented based on the shader: 
// https://www.shadertoy.com/view/3ltSW2

// The MIT License
// Copyright © 2020 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Signed distance to a disk

// List of some other 2D distances: https://www.shadertoy.com/playlist/MXdSRf
//
// and iquilezles.org/articles/distfunctions2d

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

float sdf_circle(vec2 p, vec2 c, float r) {
    return length(p - c) - r;
}

// reference: https://iquilezles.org/articles/distfunctions2d/, Box-exact
float sdf_box(in vec2 p, float angle, in vec2 b) {
    mat2 rot = mat2(cos(-angle), sin(-angle), -sin(-angle), cos(-angle));
    p = rot * p;

    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec3 vis_sdf_shader_toy(float d) {
    vec3 color = (d > 0.0) ? vec3(0.9, 0.6, 0.3) : vec3(0.65, 0.85, 1.0);
    color *= 1.0 - exp(-6.0 * abs(d));
    color *= 0.8 + 0.2 * sin(100.0 * d);
    color = mix(color, vec3(1.0), 1.0 - smoothstep(0.0, 0.01, abs(d)));
    return color;
}

vec3 vis_sdf(float d) {
    vec3 color = (d > 0.0) ? vec3(0.6) : vec3(0.25);
    float bandwidth = 0.08;
    float half_bandwidth = bandwidth * 0.5;
    float band = floor(d / bandwidth) * bandwidth;
    color *= exp(-abs(band));

    float linewidth = 0.006;
    if(abs(d - band - half_bandwidth) > half_bandwidth - linewidth) {
        color = mix(color, vec3(0.0), smoothstep(half_bandwidth - linewidth, half_bandwidth, abs(d - band - half_bandwidth)));
    }
    if(abs(d) < linewidth * 1.2) {
        color = mix(color, vec3(1.0), 1.0 - smoothstep(0.0, linewidth * 1.2, abs(d)));
    }
    return color;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;    // p's range is between (-aspect_ratio,-1) to (+aspect_ratio,+1)

    // rotating box
    vec2 b = vec2(0.2, 0.3);
    float d = sdf_box(p, iTime, b);

    // our coloring implementation
    // vec3 color = vis_sdf_shader_toy(d);
    vec3 color = vis_sdf(d);

    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}