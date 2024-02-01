#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
vec3 circle(vec2 uv, float r, float blur, vec3 col){
    float mask = smoothstep(r+blur,r , length(uv));
    return col * mask;
}

void main(){
    float t = u_time;
    vec2 uv = gl_FragCoord.xy / u_resolution - .5;
    uv.x *= u_resolution.x/ u_resolution.y;

    vec3 col = vec3(0.);
    float d = length(uv);
    float r = .3;
    float blur = abs(sin(t)) * .5;

    float mask = smoothstep(r + blur, r, d );
    col += mask;
   
    gl_FragColor = vec4(col, 1.);
}
