#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float Circle(vec2 uv, vec2 pos, float r, float blur){
    uv -= pos;
    float mask = smoothstep(r+blur, r, length(uv.xy));
    return mask;
}

float Band(float uv, float x1, float x2, float blur){
    float band1 = smoothstep(x1-blur, x1+blur , uv);
    float band2 = smoothstep(x2+blur, x2-blur, uv);
    return band1 * band2;

}
struct Rectangle {
    float x1;
    float x2;
    float x3;
    float x4;
};

float Rect(vec2 uv, Rectangle rect, float blur){
    float band1 = Band(uv.x, rect.x1, rect.x2, blur);
    float band2 = Band(uv.y, rect.x3, rect.x4, blur);

    return band1 * band2;
}

void main(){
    float t = u_time;
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -=0.5;
    uv.y *= u_resolution.y / u_resolution.x;
    vec3 col = vec3(0.0, 0.0, 0.0);
    float blur = 0.006;

    //float rect1 = Rect(vec2(x,y), Rectangle(-0.3, 0.3, -0.1, 0.1), blur);
    float x = uv.x;
    float y = uv.y + sin(t*2. + x*7.)/10.;
    float rect1 = Rect(vec2(x,y), Rectangle(-0.5, 0.5, -0.01, 0.01), blur);
    col += rect1;

    y = uv.y+cos(t*2. + x*7. + cos(1.2*t))/10.;
    float rect2 = Rect(vec2(x,y), Rectangle(-0.5, 0.5, -0.01, 0.01), blur);
    col += rect2;

    y = uv.y+cos(t*3. + x*5.)/10.;
    float rect3 = Rect(vec2(x,y), Rectangle(-0.5, 0.5, -0.01, 0.01), blur);
    col += rect3;


    col *= vec3(1./length(uv.x), 1., length(uv.y));

    gl_FragColor = vec4(col, 1.);
}