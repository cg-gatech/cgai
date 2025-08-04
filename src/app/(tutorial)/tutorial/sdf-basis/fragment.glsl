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

const float M_PI = 3.1415926535;

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

// reference: https://iquilezles.org/articles/distfunctions2d/, Triangle-exact
float sdf_triangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p - p0, v1 = p - p1, v2 = p - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}

vec2 polar2cart(float angle, float length) {
    return vec2(cos(angle) * length, sin(angle) * length);
}

// reference: https://iquilezles.org/articles/distfunctions2d/, Segment-exact
float sdf_segment(in vec2 p, in vec2 a, in vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

vec3 colormap_jet(float x) {
    x = clamp(x, 0.0, 1.0);
    float r, g, b;

    if(x < 0.7) {
        r = 4.0 * x - 1.5;
    } else {
        r = -4.0 * x + 4.5;
    }

    if(x < 0.5) {
        g = 4.0 * x - 0.5;
    } else {
        g = -4.0 * x + 3.5;
    }

    if(x < 0.3) {
        b = 4.0 * x + 0.5;
    } else {
        b = -4.0 * x + 2.5;
    }

    return vec3(clamp(r, 0.0, 1.0), clamp(g, 0.0, 1.0), clamp(b, 0.0, 1.0));
}

vec3 vis_sdf_shader_toy(float d) {
    vec3 color = (d > 0.0) ? vec3(0.9, 0.6, 0.3) : vec3(0.65, 0.85, 1.0);
    color *= 1.0 - exp(-6.0 * abs(d));
    color *= 0.8 + 0.2 * sin(100.0 * d);
    color = mix(color, vec3(1.0), 1.0 - smoothstep(0.0, 0.01, abs(d)));
    return color;
}

vec3 vis_sdf_jet(float d) {
    return colormap_jet(exp(-abs(d)));
}

vec3 vis_sdf(float d) {
    vec3 color = (d > 0.0) ? vec3(0.6) : vec3(0.25);
    float bandwidth = 0.08;
    float half_bandwidth = bandwidth * 0.5;
    float band = floor(d / bandwidth) * bandwidth;
    color *= exp(-abs(band));

    float linewidth = 0.004;
    if(abs(d - band - half_bandwidth) > half_bandwidth - linewidth) {
        color = mix(color, vec3(0.0), smoothstep(half_bandwidth - linewidth, half_bandwidth, abs(d - band - half_bandwidth)));
    }
    if(abs(d) < linewidth * 1.5) {
        color = mix(color, vec3(1.0), 1.0 - smoothstep(0.0, linewidth * 1.5, abs(d)));
    }
    return color;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;    // p's range is between (-aspect_ratio,-1) to (+aspect_ratio,+1)

    // circle
    // float d = sdf_circle(p, vec2(0.0), 0.3);

    // rotating box
    vec2 b = vec2(0.2, 0.3);
    float d = sdf_box(p, iTime, b);

    // triangle
    // vec2 p0 = polar2cart(0.0, 0.5);
    // vec2 p1 = polar2cart(0.0 + 2. * M_PI / 3., 0.5);
    // vec2 p2 = polar2cart(0.0 + 4. * M_PI / 3., 0.5);
    // float d = sdf_triangle(p, p0, p1, p2);

    // segment
    // vec2 p0 = vec2(0.5 * sin(iTime), 0.5 * cos(iTime));
    // vec2 p1 = vec2(-0.5 * sin(iTime), -0.5 * cos(iTime));
    // float d = sdf_segment(p, p0, p1);

    // different visualization implementation
    // vec3 color = vis_sdf_shader_toy(d);
    // vec3 color = vis_sdf_jet(d);
    vec3 color = vis_sdf(d);

    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}