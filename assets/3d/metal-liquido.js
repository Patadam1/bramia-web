// Gota de metal líquido: esfera deformada con ruido en el shader, sobre el material físico de three.js
import * as THREE from 'three';

const RUIDO = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
uniform float uTiempo;
uniform float uEnergia;
vec3 deforma(vec3 p){
  float t=uTiempo;
  float a=snoise(p*.62+vec3(t*.16,t*.1,-t*.12));
  float b=snoise(p*1.25+a*.5-vec3(t*.2));
  float d=a*(.3+uEnergia*.16)+b*(.05+uEnergia*.07);
  return p+normalize(p)*d;
}
`;

export function crearMetalLiquido(detalle = 96) {
  const geo = new THREE.IcosahedronGeometry(1, detalle);
  const uniforms = { uTiempo: { value: 0 }, uEnergia: { value: 0 } };
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xe9e9e9, metalness: 1, roughness: .1, clearcoat: 1, clearcoatRoughness: .08, envMapIntensity: 1.15
  });
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + RUIDO)
      .replace('#include <beginnormal_vertex>', `
        vec3 pBase = position;
        vec3 tg = normalize(cross(abs(pBase.y) < .99 ? vec3(0.,1.,0.) : vec3(1.,0.,0.), pBase));
        vec3 bt = normalize(cross(pBase, tg));
        float e = .02;
        vec3 q0 = deforma(pBase);
        vec3 q1 = deforma(normalize(pBase + tg * e));
        vec3 q2 = deforma(normalize(pBase + bt * e));
        vec3 objectNormal = normalize(cross(q1 - q0, q2 - q0));
        if (dot(objectNormal, pBase) < 0.) objectNormal = -objectNormal;
        #ifdef USE_TANGENT
          vec3 objectTangent = tg;
        #endif`)
      .replace('#include <begin_vertex>', 'vec3 transformed = q0;');
  };
  const malla = new THREE.Mesh(geo, mat);
  return {
    malla,
    actualiza(t, energia) { uniforms.uTiempo.value = t; uniforms.uEnergia.value = energia; }
  };
}
