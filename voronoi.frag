#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;

vec2 N22(vec2 p){
    vec3 a = fract(p.xyx*vec3(322.234, 937.32, 454.382));
    a += dot(a, a+69.21);
    return fract(vec2(a.x*a.z, a.y*a.x));
}
/*
    p = fract(p*vec2(421.23, 942.012));
    p += dot(p, p+832.201);

    return fract(p.y*p.x * .2120 );
*/
float N21(vec2 p){

    vec2 a = fract(p*vec2(213.231, 421.01));
    a += dot(a, a+38.292302);
    return fract(a.x*a.y);

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

Truchet truchet(vec2 uv, float edges, float width, float size, vec3 col){
    uv *= size;
    vec2 gv = fract(uv)-.5;
    vec2 id = floor(uv);
    float n = N21(id);

    if(n < .5){
        gv.x*=-1.;
    }

//    float d = abs(abs(gv.x+gv.y) -.5);
    float r = .5;
    float val = sign(gv.x + gv.y + .00001) * .5;
    vec2 cUv = gv - val; 
    float d = Length(cUv, edges);
    float mask =smoothstep(0.01,-0.01 , abs(d - r)-width);
    float angle = atan(cUv.x, cUv.y);
    float x = fract(angle/1.57);
    float y = (d-(r-width))/(2.*width);
    y = abs(y-.5) * 2.;

    col *= vec3(mask);
    //if(gv.x > .49 || gv.y > .49) col = vec3(1.);


    return Truchet(vec2(x,y), col);
}

void main(){
    float t = u_time;
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -= .5;
    uv.x *= u_resolution.x / u_resolution.y;
    vec3 col= vec3(0.);
    vec2 gv = fract(uv);
    col += voronoi(uv, 10.)*.2;
    col += voronoi(uv+.5, 15.)*.2;
    col += voronoi(uv-.2, 10.)*.2;
    col += voronoi(uv+.3, 20.)*.2;
    col += voronoi(uv-.12, 7.)*.2;
    //float vor = voronoi(uv, 40.);
    //vec3 vor = voronoi(t1.uv/10., 20.);
    float edges = ((sin(t/2.)/3.) + 1.5) * (sin(t*1.4)/2. + .85);
    vec3 vor = voronoi(uv, 100.);
    Truchet t1 = truchet(uv,edges, 0.12, 10., vec3(1.));
    //Truchet t2 = truchet(uv+.075, 1.7, 0.04, 6., vec3(0., 0., 1.));
   // col += t1.col;
    //col *= vor; 
    //col.rb *= t1.uv;

    //col += t2.col;


    gl_FragColor = vec4(col, 1.);
}