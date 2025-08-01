precision highp float;

in vec3 vtx_pos;
in vec3 vtx_normal;

uniform vec3 cameraPos;
uniform int mode;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

void main() {
    int mode_ = mode % 2;
    vec3 color = vec3(0.0);

    if(mode_ == 0) {
        // phong shading
        float shininess = 32.0;

        vec3 ks = vec3(0.9);
        vec3 kd = vec3(69, 39, 160) / 255.;
        vec3 ka = kd;

        vec3 ambient_light = vec3(0.2);

        // skylight
        vec3 light_dir = normalize(vec3(3.0, 1.0, 2.0));
        vec3 light_intensity = vec3(0.8);

        vec3 view_dir = normalize(cameraPos - vtx_pos);

        // ambient
        vec3 ambient = ka * ambient_light;

        // diffuse
        vec3 diffuse = kd * light_intensity * max(dot(vtx_normal, light_dir), 0.0);

        // specular
        vec3 reflect_dir = reflect(-light_dir, vtx_normal);
        vec3 specular = ks * light_intensity * pow(max(dot(view_dir, reflect_dir), 0.0), shininess);

        color = ambient + diffuse + specular;
    } else if(mode_ == 1) {
        // visualize normals as color
        color = vtx_normal;
    }

    gl_FragColor = vec4(color, 1.0);
}
