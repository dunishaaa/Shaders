#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;

void main(){
    float t = u_time;
    vec2 uv = gl_FragCoord.xy / u_resolution - .5;
    uv.x *= u_resolution.x/ u_resolution.y;
    vec3 col = vec3(1.);

    gl_FragColor = vec4(col, 1.);
}