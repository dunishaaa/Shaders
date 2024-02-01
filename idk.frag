#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;

void main(){
    float t = u_time;
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec3 col = vec3(0.);

//    if(gv.x > .95|| gv.y >.95) col.r = 1.;
    gl_FragColor = vec4(col, 1.);

}