#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float Hash21(vec2 p){
    p = fract(p*vec2(421.23, 942.012));
    p += dot(p, p+832.201);

    return fract(p.y*p.x * .2120 );
}

void main(){
    float t = u_time;
    vec2 uv = gl_FragCoord.xy / u_resolution;
    
    vec2 UV = uv;
    uv += t *.2;
    uv -= 0.5;
    uv.y *= u_resolution.y / u_resolution.x;

    uv *= 15.;
    vec3 col = vec3(0.);

    vec2 lv = fract(uv)-.5;
    vec2 id = floor(uv);

    float n = Hash21(id);
    float width = .10 * log(1.+UV.x+UV.y)*log(2.+UV.x+UV.y);

    if(n < .4213) lv.x*=-1.;
    float r = .5;
//    float d = abs(abs(lv.x+lv.y) - .5);
    float d = length(lv - vec2(.5))-r ;
    float mask = smoothstep(.01,-.01 , abs(d) - width);
    d = length(lv - vec2(-.5))-r ;
    mask += smoothstep(.01,-.01 , abs(d) - width);

//    col+=n;

    col+=mask;

    col *= vec3(UV.x, UV.y, UV.y);

    //if(lv.x > .48 || lv.y > .48) col = vec3(1,0,0);
    gl_FragColor = vec4(col, 1.);

}