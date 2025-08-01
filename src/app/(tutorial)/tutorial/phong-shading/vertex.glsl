// built-in attributes
// attribute vec2 uv;
// attribute vec3 position;
// attribute vec3 normal;

// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;

out vec2 vUv;
out vec3 vtx_pos;
out vec3 vtx_normal;

void main() {
  vUv = uv;
  vtx_pos =  position;
  vtx_normal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
