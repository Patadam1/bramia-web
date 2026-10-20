// Conecta el techo 3D con la hora real y con los botones "La luz del Rincón".
import { iniciaLamparas } from "./lamparas.js?v=3";

const canvas = document.querySelector("[data-techo]");
const nota = document.querySelector("[data-luz-nota]");
const botones = [...document.querySelectorAll("[data-luz]")];
const sirve = document.querySelector("[data-luz-sirve]");
const QUE_HAY = {
  manana: "Por la mañana: café con leche a 1,50 €, croissant premium y montados a 2 €.",
  mediodia: "A mediodía: menú del día a 13,50 €, con postre o café.",
  noche: "Por la noche: raciones, burgers y terraza. Torreznos, smash, Black Golden.",
  cerrado: "Ahora el bar está cerrado. Toca una lámpara para encenderla."
};

function webglDisponible() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; }
}

if (canvas && webglDisponible()) {
  const real = window.momentoRincon ? window.momentoRincon() : "noche";
  const techo = iniciaLamparas(canvas);
  techo.ponEstado(real, true);

  const marca = (nombre) => botones.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.luz === nombre)));
  marca(real);
  sirve.textContent = QUE_HAY[real];
  nota.textContent = real === "cerrado" ? "O elige una hora para verlo encendido." : "Sigue la hora real de Mota del Cuervo.";

  botones.forEach((b) => b.addEventListener("click", () => {
    const nombre = b.dataset.luz;
    techo.ponEstado(nombre);
    marca(nombre);
    sirve.textContent = QUE_HAY[nombre];
    nota.textContent = nombre === real ? "Así está ahora mismo." : "Así se ve el Rincón a esta hora.";
  }));

  // Al bajar, la cámara desciende del techo.
  const portada = document.querySelector(".portada");
  const alScroll = () => techo.scroll(window.scrollY / portada.offsetHeight);
  window.addEventListener("scroll", alScroll, { passive: true });
  alScroll();
} else if (document.querySelector("[data-luz-control]")) {
  document.querySelector("[data-luz-control]").hidden = true;
}
