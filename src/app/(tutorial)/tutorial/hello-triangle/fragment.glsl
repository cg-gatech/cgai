varying vec2 vUv;

uniform float iTime;
uniform vec2 iResolution;
uniform int iFrame;

const float M_PI = 3.1415926535;
const vec3 BG_COLOR = vec3(0);

vec2 polar2cart(float angle, float length) {
    return vec2(cos(angle) * length, sin(angle) * length);
}

bool inTriangle(vec2 p, vec2 p1, vec2 p2, vec2 p3, out vec3 bary) {
    vec2 v0 = p2 - p1;
    vec2 v1 = p3 - p1;
    vec2 v2 = p - p1;

    float D = v0.x * v1.y - v0.y * v1.x;
    float Dv = v2.x * v1.y - v2.y * v1.x;
    float Dw = v0.x * v2.y - v0.y * v2.x;
    if(D == 0.0) {
        return false;
    }
    float v = Dv / D;
    float w= Dw / D;
    float u = 1.0 - v - w;
    bary = vec3(u, v, w);
    return (u >= 0.0 && v >= 0.0 && w >= 0.0);
}

vec3 drawTriangle(vec2 pos, vec2 center) {
    float tl = min(iResolution.x, iResolution.y) * 0.35;
    vec2 p1 = polar2cart(iTime, tl) + center;
    vec2 p2 = polar2cart(iTime + 2. * M_PI / 3., tl) + center;
    vec2 p3 = polar2cart(iTime + 4. * M_PI / 3., tl) + center;
    vec3 bary;
    if(inTriangle(pos, p1, p2, p3, bary)) {
        return bary;
    }
    return vec3(0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 center = vec2(iResolution / 2.);

    vec3 fragOutput = drawTriangle(fragCoord, center);

    if(fragOutput == vec3(0)) {
        fragColor = vec4(BG_COLOR, 1.0);
    } else {
        fragColor = vec4(fragOutput, 1.0);
    }
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}