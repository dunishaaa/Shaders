#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
/*
    vec2 a = fract(p*vec2(213.231, 421.01));
    a += dot(a, a+38.292302);
    return fract(a.x*a.y);
*/
float remap01(float a, float b, float t){
    return clamp((t-a) / (b-a), 0., 1.);
}
float remap(float a, float b, float c, float d, float t){
    return remap01(a ,b , t) * (d-c) + c;
}
float N21(vec2 p){
    vec2 a = fract(p*vec2(123.234, 422.231));
    a += dot(a, a+42.23);
    return fract(a.x*a.y);
}

vec4 Iris(vec2 uv){
    vec4 col = vec4(0.749, 0.3549, 0.0196, 1.0);
    float r = .3;
    float blur = .01;
    float d = length(uv);
    col.a = smoothstep(r+blur,r , d);
    col.r = remap(.05, .3, .749, .8, d);
    col.g = remap(.05, .3, .3549, .6, d);

    float edgeFadeOut = remap01(.1, .29, d);
    edgeFadeOut = pow(edgeFadeOut, 1.5);
    col.rgb *= 1.-edgeFadeOut;
    return col;
}

vec4 Pupil(vec2 uv){
    vec4 col = vec4(vec3(0.), 1.);
    float r = .05;
    float d = length(uv);
    float blur = N21(uv);
    blur = remap(0., 1., 0., .25, blur);
   // blur = .07;

    col.a = smoothstep(r+blur,r , d);
    return col;
}
vec4 EyeSocket(vec2 uv){
    vec4 col = vec4(1.); 
    uv.y*=2.;
    uv = abs(uv);
    float r = .6;
    float blur = .01;
    float d = length(uv);
    col.a = smoothstep(r+blur,r , d);
    return col;
}
vec4 Glare1(vec2 uv){
    uv-=vec2(-.1, .1);
    vec4 col = vec4(1.);
    float r = .009;
    float blur = .06;
    float d = length(uv);
    col.a = smoothstep(.09, 0., d);
    return col;
}
vec2 N22(vec2 p){
    vec3 a = fract(p.xyx*vec3(322.234, 937.32, 454.382));
    a += dot(a, a+69.21);
    return fract(vec2(a.x*a.z, a.y*a.x));
}


struct Truchet{
    vec2 uv;
    vec3 col;
};

float Length(vec2 p1, float k){
    p1 = abs(p1);
    return pow(pow(p1.x, k) + pow(p1.y, k), 1./k);
}
vec3 voronoi(vec2 uv, float size){
    float t = u_time;
    uv*=size;
    vec2 gv = fract(uv)-.5;
    vec2 gId = floor(uv);
    vec2 minId = vec2(0);
    float minDist = 100.;
    for(float y = -1.; y < 2.; y++){
        for(float x = -1.; x < 2.; x++){
            vec2 offs = vec2(x, y);
            vec2 n = N22(gId + offs);
            vec2 p = offs+sin(n*t*3.)*.9;
            float d = Length(gv - p, 2.);
            if(d < minDist){
                minDist = d;
                minId =  vec2(gId+offs);
            }
        }
    }
    vec3 col = vec3(minDist);
//    if(gv.x > .46 || gv.y > .46) col = vec3(1., 0., 0.);
    
     
    return col;
}
vec4 Glare2(vec2 uv){
    uv -= vec2(.1, -.08);
    vec4 col = vec4(1.);
    float d = length(uv);
    col.a = smoothstep(.04, 0., d);
    return col;
}

void main(){
    float t = u_time;
    vec2 uv = gl_FragCoord.xy / u_resolution - .5;
    uv.x *= u_resolution.x/ u_resolution.y;
    vec4 col = vec4(vec3(0.),1.);

    vec4 iris = Iris(uv);
    col = mix(col, iris, iris.a);
    vec4 pupil = Pupil(uv);
    col = mix(col, pupil, pupil.a);
    vec4 glare1 = Glare1(uv);
    col = mix(col, glare1, glare1.a);
    vec4 glare2 = Glare2(uv);
    col = mix(col, glare2, glare2.a);
    /*
    col = vec4(vec3(0.), 1.);

    col.rgb += voronoi(uv, 10.)*.3;
    col.rgb += voronoi(uv+.5, 15.)*.2;
    col.rgb += voronoi(uv-.5, 10.)*.4;
*/
    gl_FragColor = col;
}
