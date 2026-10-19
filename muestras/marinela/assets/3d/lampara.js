// Lámpara de mimbre en 3D, como las del techo de El Rincón.
// Pantalla de mimbre trenzado con agujeros, bombilla dentro y luz cálida.
import * as THREE from 'three';
import { EffectComposer } from '../vendor/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../vendor/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../vendor/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '../vendor/jsm/postprocessing/OutputPass.js';

// Trenzado de mimbre dibujado en un canvas: color y máscara de agujeros
function texturasMimbre(rep = 1) {
  const N = 512, c = document.createElement('canvas'), a = document.createElement('canvas');
  c.width = a.width = N; c.height = a.height = N;
  const x = c.getContext('2d'), m = a.getContext('2d');
  x.fillStyle = '#6E4F2C'; x.fillRect(0, 0, N, N);
  m.fillStyle = '#000'; m.fillRect(0, 0, N, N);
  const paso = N / 8, ancho = paso * 0.62;
  // tiras diagonales en dos direcciones, pasando por encima y por debajo
  for (let dir of [1, -1]) {
    for (let i = -8; i < 16; i++) {
      const x0 = i * paso;
      for (let t = 0; t < 8; t++) {
        const encima = (i + t + (dir > 0 ? 0 : 1)) % 2 === 0;
        x.save(); m.save();
        x.translate(x0 + t * paso * dir, t * paso); m.translate(x0 + t * paso * dir, t * paso);
        x.rotate(dir * Math.PI / 4); m.rotate(dir * Math.PI / 4);
        const L = paso * 1.42;
        const g = x.createLinearGradient(0, -ancho / 2, 0, ancho / 2);
        const tono = encima ? ['#8A6236', '#D9AE72', '#B3854D', '#7A5530'] : ['#6A4927', '#A87C46', '#94693A', '#5E4122'];
        g.addColorStop(0, tono[0]); g.addColorStop(.35, tono[1]); g.addColorStop(.7, tono[2]); g.addColorStop(1, tono[3]);
        x.fillStyle = g; x.fillRect(0, -ancho / 2, L, ancho);
        // vetas finas de la fibra
        x.globalAlpha = .18; x.fillStyle = '#3E2A14';
        for (let k = 0; k < 5; k++) x.fillRect(0, -ancho / 2 + Math.random() * ancho, L, 1);
        x.globalAlpha = 1;
        m.fillStyle = '#fff'; m.fillRect(0, -ancho / 2, L, ancho);
        x.restore(); m.restore();
      }
    }
  }
  const mapa = new THREE.CanvasTexture(c), mascara = new THREE.CanvasTexture(a);
  for (const t of [mapa, mascara]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep * 10, rep * 4); t.anisotropy = 8; }
  mapa.colorSpace = THREE.SRGBColorSpace;
  return { mapa, mascara };
}

export function crearLampara(canvas, { movil = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, movil ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const escena = new THREE.Scene();
  escena.background = new THREE.Color('#161616');
  
  const camara = new THREE.PerspectiveCamera(32, 1, .1, 100);
  camara.position.set(0, -0.4, movil ? 15 : 9);

  // Grupo que cuelga del cable y se balancea desde arriba
  const pivote = new THREE.Group(); pivote.position.y = 4.2; escena.add(pivote);
  const lampara = new THREE.Group(); lampara.position.y = -3.4; pivote.add(lampara);

  const cable = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 3.4, 8), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: .6 }));
  cable.position.y = -1.7; pivote.add(cable);

  // Pantalla en forma de campana ancha, como las de su techo
  const perfil = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const r = .16 + 1.45 * Math.pow(Math.sin(t * Math.PI / 2), .85);
    const y = .95 - 1.25 * Math.pow(t, 1.6);
    perfil.push(new THREE.Vector2(r, y));
  }
  const { mapa, mascara } = texturasMimbre();
  const pantalla = new THREE.Mesh(new THREE.LatheGeometry(perfil, 160),
    new THREE.MeshStandardMaterial({ map: mapa, alphaMap: mascara, alphaTest: .5, side: THREE.DoubleSide, roughness: .75, metalness: 0, emissive: new THREE.Color('#ffb25a'), emissiveMap: mapa, emissiveIntensity: 0 }));
  lampara.add(pantalla);
  // aro del borde
  const aro = new THREE.Mesh(new THREE.TorusGeometry(1.61, .035, 12, 160), new THREE.MeshStandardMaterial({ color: '#8E6A3C', roughness: .6 }));
  aro.rotation.x = Math.PI / 2; aro.position.y = -.3; lampara.add(aro);
  const remate = new THREE.Mesh(new THREE.CylinderGeometry(.18, .2, .14, 32), new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: .5 }));
  remate.position.y = .98; lampara.add(remate);

  // Bombilla y luz cálida
  const bombilla = new THREE.Mesh(new THREE.SphereGeometry(.2, 32, 16), new THREE.MeshBasicMaterial({ color: '#ffe7c2' }));
  bombilla.position.y = .25; lampara.add(bombilla);
  const luz = new THREE.PointLight('#ffb866', 0, 14, 1.6); luz.position.y = .2; lampara.add(luz);
  // Haz de luz que cae: cono aditivo que se desvanece hacia abajo
  const hc = document.createElement('canvas'); hc.width = 4; hc.height = 256;
  const hx = hc.getContext('2d'), hg = hx.createLinearGradient(0, 0, 0, 256);
  hg.addColorStop(0, 'rgba(255,190,110,.6)'); hg.addColorStop(.3, 'rgba(255,170,90,.12)'); hg.addColorStop(1, 'rgba(255,160,80,0)');
  hx.fillStyle = hg; hx.fillRect(0, 0, 4, 256);
  const haz = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 4.6, 7, 64, 1, true),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hc), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, opacity: 0 }));
  haz.position.y = -3.8; lampara.add(haz);
  const ambiente = new THREE.HemisphereLight('#fff4e6', '#1a1410', .35); escena.add(ambiente);
  const clave = new THREE.DirectionalLight('#ffffff', .55); clave.position.set(3, 4, 6); escena.add(clave);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(escena, camara));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .5, .35, .62);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let w = 1, h = 1;
  function ajusta() {
    const r = canvas.getBoundingClientRect(); w = Math.max(1, r.width); h = Math.max(1, r.height);
    renderer.setSize(w, h, false); composer.setSize(w, h); camara.aspect = w / h; camara.updateProjectionMatrix();
  }
  ajusta(); addEventListener('resize', ajusta);

  // Estado: encendida o apagada, balanceo y scroll
  let encendida = 0, objetivo = 1, vx = 0, angulo = 0, empuje = 0, scroll = 0;
  return {
    encender(si) { objetivo = si ? 1 : 0; },
    empujar(dx) { empuje += dx; },
    scroll(p) { scroll = p; },
    paso(t, dt) {
      encendida += (objetivo - encendida) * Math.min(1, dt * 3);
      const parpadeo = objetivo ? 1 - .03 * Math.sin(t * 7.3) * Math.sin(t * 2.1) : 1;
      luz.intensity = 9 * encendida * parpadeo;
      pantalla.material.emissiveIntensity = .32 * encendida;
      bombilla.material.color.setRGB(.25 + .75 * encendida, .24 + .71 * encendida, .23 + .64 * encendida);
      bloom.strength = .15 + .45 * encendida;
      haz.material.opacity = .11 * encendida;
      // péndulo con muelle
      const fuerza = -angulo * 9 - vx * 1.6 + empuje; empuje = 0;
      vx += fuerza * dt; angulo += vx * dt;
      pivote.rotation.z = angulo + Math.sin(t * .7) * .015;
      lampara.rotation.y = t * .18 + scroll * 2.4;
      pivote.position.y = 4.2 + scroll * 2.2;
      composer.render(dt);
    },
    ajusta,
    get encendida() { return encendida; }
  };
}
