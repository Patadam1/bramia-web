// El techo del Rincón: las lámparas redondas forradas de cuerda, en 3D.
// La luz sigue la hora real de Mota del Cuervo (mañana, mediodía, noche o cerrado).
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// ---------- Textura de cuerda trenzada, dibujada a mano en canvas ----------
function texturasCuerda(vueltas) {
  const W = 1024, H = 64 * vueltas;
  const color = document.createElement("canvas"), alto = document.createElement("canvas");
  color.width = alto.width = W; color.height = alto.height = H;
  const c = color.getContext("2d"), a = alto.getContext("2d");
  const fila = H / vueltas;
  let semilla = 7;
  const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647);
  for (let v = 0; v < vueltas; v++) {
    const y0 = v * fila;
    // cuerpo de la cuerda: más claro en el centro, oscuro en los bordes (es redonda)
    const g = c.createLinearGradient(0, y0, 0, y0 + fila);
    g.addColorStop(0, "#3d2a17"); g.addColorStop(0.22, "#9a7346"); g.addColorStop(0.5, "#c9a06a");
    g.addColorStop(0.78, "#8d653b"); g.addColorStop(1, "#2e1f11");
    c.fillStyle = g; c.fillRect(0, y0, W, fila);
    const ga = a.createLinearGradient(0, y0, 0, y0 + fila);
    ga.addColorStop(0, "#000"); ga.addColorStop(0.5, "#fff"); ga.addColorStop(1, "#000");
    a.fillStyle = ga; a.fillRect(0, y0, W, fila);
    // las hebras torcidas: franjas en diagonal
    const paso = fila * 0.55;
    for (let x = -fila; x < W + fila; x += paso) {
      c.save(); a.save();
      c.beginPath(); c.rect(0, y0, W, fila); c.clip();
      a.beginPath(); a.rect(0, y0, W, fila); a.clip();
      c.translate(x, y0); a.translate(x, y0);
      c.transform(1, 0, -0.75, 1, 0, 0); a.transform(1, 0, -0.75, 1, 0, 0);
      c.fillStyle = "rgba(30,18,8,0.55)"; c.fillRect(0, 0, 3, fila);
      c.fillStyle = "rgba(255,226,170,0.16)"; c.fillRect(5, 0, paso * 0.45, fila);
      a.fillStyle = "rgba(0,0,0,0.75)"; a.fillRect(0, 0, 3, fila);
      c.restore(); a.restore();
    }
    // fibras sueltas
    for (let i = 0; i < 260; i++) {
      const x = azar() * W, y = y0 + azar() * fila, l = 4 + azar() * 10;
      c.strokeStyle = azar() > 0.5 ? "rgba(255,230,180,0.18)" : "rgba(40,24,10,0.25)";
      c.lineWidth = 0.8; c.beginPath(); c.moveTo(x, y); c.lineTo(x + l, y - l * 0.6); c.stroke();
    }
  }
  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(alto);
  for (const t of [map, bump]) { t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.anisotropy = 8; }
  return { map, bump };
}

// ---------- Estados de luz según la hora ----------
export const ESTADOS = {
  manana:   { lampara: 0.55, color: 0xffe6c7, techo: 0x2a2724, ambiente: 0.9, cielo: 0xb9c7d4, bloom: 0.28, exp: 1.0 },
  mediodia: { lampara: 0.75, color: 0xffd8ab, techo: 0x211d19, ambiente: 0.55, cielo: 0x9a9890, bloom: 0.34, exp: 0.95 },
  noche:    { lampara: 1.0,  color: 0xffb066, techo: 0x110d0a, ambiente: 0.18, cielo: 0x3a2a1c, bloom: 0.42, exp: 0.95 },
  cerrado:  { lampara: 0.3,  color: 0xff9e52, techo: 0x0b0a09, ambiente: 0.08, cielo: 0x23304a, bloom: 0.35, exp: 0.9 }
};

export function iniciaLamparas(canvas, opciones = {}) {
  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a09);
  scene.fog = new THREE.FogExp2(0x0a0a09, 0.055);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.12;
  room.dispose(); pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  const objetivo = new THREE.Vector3(0, 3.1, -6);

  // Techo
  const techoMat = new THREE.MeshStandardMaterial({ color: 0x1a1714, roughness: 0.95 });
  const techo = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), techoMat);
  techo.rotation.x = Math.PI / 2; techo.position.y = 4.6;
  scene.add(techo);

  const hemi = new THREE.HemisphereLight(0x9fb2c4, 0x0a0a09, 0.3);
  scene.add(hemi);

  // Lámparas: radio, posición y altura (como en el local: a distintas alturas)
  const disposicion = [
    { r: 1.9, x: -0.4, z: -5.0, y: 3.55 },
    { r: 1.35, x: -4.6, z: -3.2, y: 3.15 },
    { r: 1.55, x: 4.3, z: -3.6, y: 3.35 },
    { r: 1.1, x: 1.9, z: -9.5, y: 3.8 },
    { r: 1.25, x: -3.4, z: -10.5, y: 3.85 },
    { r: 0.95, x: 6.8, z: -9.0, y: 3.9 },
    { r: 1.0, x: -7.6, z: -7.0, y: 3.6 }
  ];
  const lamparas = [];
  const cuerdaGrande = texturasCuerda(9), cuerdaBorde = texturasCuerda(3);
  for (const d of disposicion) {
    const g = new THREE.Group();
    const alto = 0.42 + d.r * 0.08;
    const mapR = cuerdaGrande.map.clone(); mapR.repeat.set(Math.round(d.r * 3), 1); mapR.needsUpdate = true;
    const bumpR = cuerdaGrande.bump.clone(); bumpR.repeat.copy(mapR.repeat); bumpR.needsUpdate = true;
    const cuerdaMat = new THREE.MeshStandardMaterial({ map: mapR, bumpMap: bumpR, bumpScale: 2.2, roughness: 0.88, metalness: 0, side: THREE.DoubleSide });
    const aro = new THREE.Mesh(new THREE.CylinderGeometry(d.r, d.r * 1.01, alto, 128, 1, true), cuerdaMat);
    g.add(aro);
    // los bordes redondos de cuerda, arriba y abajo
    const mapB = cuerdaBorde.map.clone(); mapB.repeat.set(Math.round(d.r * 18), 1); mapB.needsUpdate = true;
    const bordeMat = new THREE.MeshStandardMaterial({ map: mapB, roughness: 0.9 });
    for (const yy of [alto / 2, -alto / 2]) {
      const t = new THREE.Mesh(new THREE.TorusGeometry(d.r, 0.045, 12, 160), bordeMat);
      t.rotation.x = Math.PI / 2; t.position.y = yy; g.add(t);
    }
    // difusor blanco por debajo, que es la luz
    const difusorMat = new THREE.MeshStandardMaterial({ color: 0xf3efe8, emissive: 0xffb46a, emissiveIntensity: 2, roughness: 0.6 });
    const difusor = new THREE.Mesh(new THREE.CircleGeometry(d.r * 0.985, 96), difusorMat);
    difusor.rotation.x = Math.PI / 2; difusor.position.y = -alto / 2 + 0.06;
    g.add(difusor);
    // el foco central, más brillante
    const focoMat = new THREE.MeshBasicMaterial({ color: 0xffd9a8 });
    const foco = new THREE.Mesh(new THREE.CircleGeometry(d.r * 0.12, 48), focoMat);
    foco.rotation.x = Math.PI / 2; foco.position.y = -alto / 2 + 0.055;
    g.add(foco);
    // tres cables al techo
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const largo = 4.6 - d.y - alto / 2;
    for (let i = 0; i < 3; i++) {
      const ang = (i / 3) * Math.PI * 2 + 0.4;
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, largo, 4), cableMat);
      cable.position.set(Math.cos(ang) * d.r * 0.8, alto / 2 + largo / 2, Math.sin(ang) * d.r * 0.8);
      g.add(cable);
    }
    // luz que ilumina las otras lámparas y el techo
    const luz = new THREE.PointLight(0xffb46a, 6, 14, 1.6);
    luz.position.y = -alto / 2 - 0.4;
    g.add(luz);
    const sube = new THREE.PointLight(0xffb46a, 2, 4, 2);
    sube.position.y = alto / 2 + 0.25;
    g.add(sube);

    // cono de luz que cae de la lámpara
    const conoMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0xffb066) }, uFuerza: { value: 0.0 } },
      vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV;
        void main(){ vY = uv.y; vec4 mv = modelViewMatrix * vec4(position,1.0);
          vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 uColor; uniform float uFuerza; varying float vY; varying vec3 vN; varying vec3 vV;
        void main(){ float borde = pow(abs(dot(vN, vV)), 1.6); float cae = pow(vY, 1.8);
          gl_FragColor = vec4(uColor * uFuerza * borde * cae, 1.0); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
    });
    const cono = new THREE.Mesh(new THREE.CylinderGeometry(d.r * 0.93, d.r * 1.9, 3.4, 64, 1, true), conoMat);
    cono.position.y = -alto / 2 - 1.7;
    g.add(cono);

    g.position.set(d.x, d.y, d.z);
    scene.add(g);
    lamparas.push({ g, difusorMat, focoMat, luz, sube, conoMat, base: d, angX: 0, angZ: 0, velX: 0, velZ: 0, brillo: 1, encendida: false, fase: Math.random() * 6.28 });
  }

  // Polvo flotando en la luz
  const N = 700, posPolvo = new Float32Array(N * 3), fasePolvo = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const l = disposicion[i % 4];
    const ang = Math.random() * Math.PI * 2, rad = Math.sqrt(Math.random()) * l.r * 1.4;
    posPolvo[i * 3] = l.x + Math.cos(ang) * rad;
    posPolvo[i * 3 + 1] = l.y - 0.4 - Math.random() * 3.2;
    posPolvo[i * 3 + 2] = l.z + Math.sin(ang) * rad;
    fasePolvo[i] = Math.random() * 100;
  }
  const geoPolvo = new THREE.BufferGeometry();
  geoPolvo.setAttribute("position", new THREE.BufferAttribute(posPolvo, 3));
  geoPolvo.setAttribute("fase", new THREE.BufferAttribute(fasePolvo, 1));
  const polvoMat = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uColor: { value: new THREE.Color(0xffc58a) }, uFuerza: { value: 1 }, uPx: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float fase; uniform float uT; uniform float uPx; varying float vA;
      void main(){ vec3 p = position; p.x += sin(uT*0.21 + fase)*0.18; p.y += sin(uT*0.13 + fase*1.7)*0.25; p.z += cos(uT*0.17 + fase)*0.18;
        vec4 mv = modelViewMatrix * vec4(p,1.0); gl_PointSize = uPx * (2.2 + fract(fase)*2.0) * (6.0 / -mv.z);
        vA = 0.35 + 0.65*fract(fase*3.1); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uFuerza; varying float vA;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor * a * vA * uFuerza * 0.55, 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const polvo = new THREE.Points(geoPolvo, polvoMat);
  scene.add(polvo);

  // Luz que rebota de las mesas blancas hacia arriba
  const rebote = new THREE.PointLight(0xffb066, 0, 16, 1.5);
  rebote.position.set(0, 0.6, -4);
  scene.add(rebote);

  // Post: brillo de las bombillas
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.45, 0.78);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ---------- Estado de luz ----------
  let actual = { ...ESTADOS.noche }, destino = ESTADOS.noche, nombreEstado = "noche";
  const col = new THREE.Color(), colTecho = new THREE.Color(), colCielo = new THREE.Color();
  function ponEstado(nombre, inmediato) {
    nombreEstado = nombre; destino = ESTADOS[nombre];
    lamparas.forEach((l) => { l.encendida = true; l.aMano = false; });
    if (inmediato) { actual = { ...destino }; lamparas.forEach((l) => (l.brillo = l.encendida ? destino.lampara : 0)); }
  }
  function enciendeUna(i) {
    const l = lamparas[i]; if (!l) return;
    l.aMano = !l.aMano; l.parpadeo = 0.35;
  }

  // ---------- Puntero: la cámara respira y las lámparas se mecen ----------
  const puntero = { x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0, activo: false };
  function mueve(e) {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1, y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    puntero.vx = x - puntero.x; puntero.vy = y - puntero.y; puntero.x = x; puntero.y = y; puntero.activo = true;
  }
  canvas.addEventListener("pointermove", mueve, { passive: true });
  canvas.addEventListener("pointerdown", (e) => {
    mueve(e);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(puntero.x, puntero.y), camera);
    const hits = ray.intersectObjects(lamparas.map((l) => l.g), true);
    if (hits.length) {
      const i = lamparas.findIndex((l) => hits[0].object.parent === l.g);
      if (nombreEstado === "cerrado") enciendeUna(i);
      const l = lamparas[i]; if (l) { l.velX += 0.9 * (Math.random() - 0.5); l.velZ += 0.9; }
      opciones.alTocar && opciones.alTocar(i);
    }
  });

  // ---------- Tamaño ----------
  let vertical = false;
  function ajusta() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); composer.setSize(w, h);
    camera.aspect = w / h;
    vertical = w / h < 0.8;
    camera.fov = vertical ? 58 : 42;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(ajusta).observe(canvas);
  ajusta();

  // ---------- Bucle ----------
  let progresoScroll = 0, visible = true, t = 0;
  const v3 = new THREE.Vector3();
  let antes = performance.now();
  function fotograma() {
    const ahora = performance.now();
    const dt = Math.min((ahora - antes) / 1000, 0.05); antes = ahora;
    t += dt;
    // mezcla suave hacia el estado de luz
    const k = 1 - Math.pow(0.02, dt);
    for (const key of ["lampara", "ambiente", "bloom", "exp"]) actual[key] += (destino[key] - actual[key]) * k;
    col.set(actual.color || destino.color); col.lerp(new THREE.Color(destino.color), k); actual.color = col.getHex();
    colTecho.set(techoMat.color).lerp(new THREE.Color(destino.techo), k); techoMat.color.copy(colTecho);
    colCielo.set(hemi.color).lerp(new THREE.Color(destino.cielo), k); hemi.color.copy(colCielo);
    hemi.intensity = actual.ambiente;
    bloom.strength = actual.bloom;
    renderer.toneMappingExposure = actual.exp;

    // cámara: mira hacia arriba, el puntero la mueve un poco y el scroll la baja
    const px = reducir ? 0 : puntero.x, py = reducir ? 0 : puntero.y;
    if (opciones.camara) {
      camera.position.set(...opciones.camara.pos); camera.lookAt(...opciones.camara.mira);
    } else {
      // en el móvil la cámara se acerca y baja para que las lámparas llenen la mitad de arriba
      const camObj = vertical
        ? v3.set(px * 0.3, 1.2 + py * 0.15 - progresoScroll * 1.2, 2.6 + progresoScroll * 1.2)
        : v3.set(px * 0.6, 1.9 + py * 0.25 - progresoScroll * 1.4, 6.0 + progresoScroll * 1.5);
      camera.position.lerp(camObj, 1 - Math.pow(0.08, dt));
      if (vertical) camera.lookAt(-0.3 + px * 0.2, 1.8 - progresoScroll * 2.2, -5);
      else camera.lookAt(objetivo.x + px * 0.4, objetivo.y - progresoScroll * 2.2, objetivo.z);
    }

    lamparas.forEach((l, i) => {
      // brillo: cada lámpara sube a su objetivo; si se enciende a mano, parpadea un poco
      const meta = l.aMano ? 1.0 : actual.lampara;
      l.brillo += (meta - l.brillo) * (1 - Math.pow(0.03, dt));
      let b = l.brillo;
      if (l.parpadeo > 0) { l.parpadeo -= dt; b *= l.parpadeo > 0 ? (Math.sin(t * 90 + i) > 0.2 ? 1 : 0.25) : 1; }
      l.difusorMat.emissive.set(actual.color);
      l.difusorMat.emissiveIntensity = b * 1.1;
      l.focoMat.color.set(actual.color).multiplyScalar(0.15 + b * 2.4);
      l.luz.color.set(actual.color); l.luz.intensity = b * 2.2;
      l.sube.color.set(actual.color); l.sube.intensity = b * 0.9;
      l.conoMat.uniforms.uColor.value.set(actual.color); l.conoMat.uniforms.uFuerza.value = b * 0.11;
      // vaivén: muelle amortiguado, empujado por el puntero cerca de la lámpara
      if (!reducir) {
        v3.copy(l.g.position).project(camera);
        const dx = v3.x - puntero.x, dy = v3.y - puntero.y, cerca = Math.exp(-(dx * dx + dy * dy) * 6);
        if (puntero.activo) { l.velZ += puntero.vx * cerca * 2.2; l.velX -= puntero.vy * cerca * 2.2; }
        l.velX += (-l.angX * 9 - l.velX * 1.6) * dt; l.velZ += (-l.angZ * 9 - l.velZ * 1.6) * dt;
        l.angX += l.velX * dt; l.angZ += l.velZ * dt;
        l.g.rotation.x = l.angX * 0.35 + Math.sin(t * 0.6 + l.fase) * 0.008;
        l.g.rotation.z = l.angZ * 0.35 + Math.cos(t * 0.5 + l.fase) * 0.008;
        l.g.rotation.y += dt * 0.02;
      }
    });
    puntero.vx *= 0.8; puntero.vy *= 0.8;
    const media = lamparas.reduce((s, l) => s + l.brillo, 0) / lamparas.length;
    polvoMat.uniforms.uT.value = reducir ? 0 : t;
    polvoMat.uniforms.uColor.value.set(actual.color); polvoMat.uniforms.uFuerza.value = 0.15 + media;
    rebote.color.set(actual.color); rebote.intensity = media * 3.5;
    if (visible) composer.render(dt);
  }
  renderer.setAnimationLoop(fotograma);

  // Pausa fuera de pantalla
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; renderer.setAnimationLoop(visible ? fotograma : null); }).observe(canvas);

  return {
    ponEstado,
    estado: () => nombreEstado,
    scroll: (p) => (progresoScroll = Math.max(0, Math.min(1, p)))
  };
}
