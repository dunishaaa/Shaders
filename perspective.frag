#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;

void main(){
    float t = u_time;
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x *= u_resolution.x/ u_resolution.y;
    vec2 UV = uv-.5;
    float mult = 10.;
    uv*= mult;
    vec2 gv = fract(uv);
    vec2 id = floor(uv);
    vec4 col = vec4(vec3(0.),1.);
    float r = .1;
    float blur = .001;
    float pos = sin(t*2.+id.x*.5)/2. + .5;
//    vec2 pos = vec2(0.);
    float d = length(gv - pos);
    float mask = smoothstep(r + blur,r ,d);
    col += mask;



//    if(gv.x > .95|| gv.y >.95) col.r = 1.;
    gl_FragColor = col;

}