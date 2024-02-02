#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;

float Torus(vec2 uv, float r1, float width){
    float d = length(uv);
    float blur = .01;
    float c1 =  smoothstep(width + r1 + blur, width + r1,d);
    float c2 =  smoothstep(r1, r1-blur,d);
    return c1-c2 ;
}

void main(){
    float t = u_time;
    vec2 uv = gl_FragCoord.xy / u_resolution - .5;
    uv.x *= u_resolution.x/ u_resolution.y;
    vec3 col = vec3(0.);

    float mask = Torus(uv, .2, .005);


    col += mask;


    gl_FragColor = vec4(col, 1.);
}