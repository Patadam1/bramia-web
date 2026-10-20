(function () {
  "use strict";

  // Enlace CSV de la hoja de Google donde caen las respuestas del formulario del
  // menú del día (Archivo › Compartir › Publicar en la web › CSV). Vacío = ejemplo.
  var MENU_HOJA = "";

  var HORARIO = { 0: [9, 24], 1: [9, 23], 2: null, 3: [9, 23], 4: [9, 23], 5: [9, 24], 6: [9, 24] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euros = function (n) { return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; };
  var esc = function (t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
  var mayus = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };

  // La hora de Mota del Cuervo, venga de donde venga quien mira.
  function ahoraMadrid() {
    var p = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false, year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { dia: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), hora: (+p.hour % 24) + (+p.minute) / 60, fecha: p.year + "-" + p.month + "-" + p.day, d: +p.day, m: +p.month - 1 };
  }
  var hhmm = function (h) { return h + ":00"; };

  // ¿Qué toca ahora en el Rincón? Lo usan la portada 3D y "Un día en el Rincón".
  window.momentoRincon = function () {
    var a = ahoraMadrid(), hoy = HORARIO[a.dia];
    if (!hoy || a.hora < hoy[0] || a.hora >= hoy[1]) return "cerrado";
    if (a.hora < 13) return "manana";
    if (a.hora < 17) return "mediodia";
    return "noche";
  };

  function pintaAhora() {
    var a = ahoraMadrid(), hoy = HORARIO[a.dia], caja = $("[data-ahora]"), txt = $("[data-ahora-texto]");
    var fila = $('[data-horario] tr[data-dia="' + a.dia + '"]');
    $$("[data-horario] tr[data-hoy]").forEach(function (f) { f.removeAttribute("data-hoy"); });
    if (fila) fila.setAttribute("data-hoy", "");
    var abierto = hoy && a.hora >= hoy[0] && a.hora < hoy[1], m;
    if (abierto) m = "Abierto ahora · hoy hasta las " + hhmm(hoy[1]);
    else if (hoy && a.hora < hoy[0]) m = "Hoy abrimos a las " + hhmm(hoy[0]);
    else {
      var sig = (a.dia + 1) % 7, salto = 1;
      while (!HORARIO[sig]) { sig = (sig + 1) % 7; salto++; }
      m = (a.dia === 2 ? "Los martes descansamos" : "Ahora cerrado") + " · abrimos " + (salto === 1 ? "mañana" : "el " + DIAS[sig]) + " a las " + hhmm(HORARIO[sig][0]);
    }
    caja.setAttribute("data-abierto", abierto ? "1" : "0");
    txt.textContent = m;
  }

  /* ---------- Menú del día ---------- */
  function parseCSV(t) {
    var filas = [], fila = [], campo = "", q = false;
    for (var i = 0; i < t.length; i++) {
      var c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { campo += '"'; i++; } else q = false; } else campo += c; }
      else if (c === '"') q = true;
      else if (c === ",") { fila.push(campo); campo = ""; }
      else if (c === "\n") { fila.push(campo); filas.push(fila); fila = []; campo = ""; }
      else if (c !== "\r") campo += c;
    }
    if (campo || fila.length) { fila.push(campo); filas.push(fila); }
    return filas;
  }
  var lineas = function (s) { return String(s || "").split(/\r?\n|;/).map(function (x) { return x.replace(/^[-•·*\s]+/, "").trim(); }).filter(Boolean); };

  function pintaMenu(m, real) {
    $("[data-menu-primeros]").innerHTML = m.primeros.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    $("[data-menu-segundos]").innerHTML = m.segundos.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    $("[data-menu-precio]").textContent = euros(m.precio);
    var a = ahoraMadrid(), dia = $("[data-menu-dia]"), fecha = $("[data-menu-fecha]"), nota = $("[data-menu-nota]");
    if (real && m.fecha) {
      var d = m.fecha, iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      dia.textContent = iso === a.fecha ? "Hoy" : mayus(DIAS[d.getDay()]);
      fecha.textContent = DIAS[d.getDay()] + " " + d.getDate() + " de " + MESES[d.getMonth()];
      nota.textContent = iso === a.fecha ? "Lo ha escrito el bar esta mañana." : "Es el último menú publicado. El de hoy, pregúntalo por teléfono.";
    } else {
      dia.textContent = "Menú de ejemplo";
      fecha.textContent = "cambia cada día";
      nota.textContent = "Así es un menú de la casa. El de hoy lo publica el bar cada mañana; si no está, pregúntalo por teléfono.";
    }
  }

  function cargaMenu() {
    pintaMenu(window.MENU_EJEMPLO, false);
    if (!MENU_HOJA) return;
    fetch(MENU_HOJA + (MENU_HOJA.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now()).then(function (r) { return r.text(); }).then(function (t) {
      var filas = parseCSV(t).filter(function (f) { return f.length >= 4 && f[1]; });
      var u = filas[filas.length - 1]; if (!u || filas.length < 2) return;
      // Columnas del formulario: Marca temporal, Primeros, Segundos, Precio
      var p = u[0].match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      var precio = parseFloat(String(u[3]).replace(",", ".").replace(/[^\d.]/g, "")) || window.MENU_EJEMPLO.precio;
      var m = { primeros: lineas(u[1]), segundos: lineas(u[2]), precio: precio, fecha: p ? new Date(+p[3], +p[2] - 1, +p[1]) : null };
      if (m.primeros.length && m.segundos.length) pintaMenu(m, true);
    }).catch(function () {});
  }

  /* ---------- La carta, por pestañas ---------- */
  function filaPlato(p) {
    var marcas = [];
    if (p.nuevo) marcas.push("nuevo");
    if (p.casa) marcas.push("de la casa");
    if (p.pica) marcas.push("pica");
    var marca = marcas.length ? '<span class="marca">' + marcas.join(" · ") + '</span>' : "";
    if (p.confirmar) marca += '<span class="marca marca-confirmar">nombre por confirmar</span>';
    return '<li class="plato"><span class="plato-nombre">' + (p.num ? '<span class="plato-num">' + p.num + '</span>' : "") + esc(p.n) + marca + '</span>' +
      '<span class="plato-puntos" aria-hidden="true"></span>' +
      '<span class="plato-precio">' + (typeof p.p === "number" ? euros(p.p) : esc(p.texto)) + '</span>' +
      (p.d ? '<span class="plato-desc">' + esc(p.d) + '</span>' : "") + '</li>';
  }

  function htmlCategoria(cat) {
    var n = cat.grupos.reduce(function (s, g) { return s + g.platos.length; }, 0);
    return '<div class="cat-cabeza"><div class="cat-texto"><h3 class="cat-titulo">' + esc(cat.nombre) + '</h3><p class="cat-cuenta">' + n + ' platos</p></div>' +
      (cat.foto ? '<figure class="cat-foto"><img src="' + cat.foto.src + '" alt="' + esc(cat.foto.alt) + '" width="382" height="510"></figure>' : "") + '</div>' +
      (cat.nota ? '<p class="cat-nota">' + esc(cat.nota) + '</p>' : "") +
      cat.grupos.map(function (g) {
        return '<div class="grupo"><h4 class="grupo-titulo">' + esc(g.nombre) + '</h4><ul class="platos">' + g.platos.map(filaPlato).join("") + '</ul></div>';
      }).join("");
  }

  function montaCarta() {
    var tabs = $("[data-pestanas]"), panel = $("[data-panel]"), actual = 0;
    tabs.innerHTML = window.CARTA.map(function (c, i) {
      return '<button class="pestana" role="tab" type="button" id="tab-' + c.id + '" aria-controls="carta-panel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-i="' + i + '">' + esc(c.corto || c.nombre) + '</button>';
    }).join("");
    panel.id = "carta-panel";
    function muestra(i, foco) {
      actual = i;
      $$(".pestana", tabs).forEach(function (b, j) { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; if (j === i && foco) b.focus(); });
      panel.setAttribute("aria-labelledby", "tab-" + window.CARTA[i].id);
      var pinta = function () { panel.innerHTML = htmlCategoria(window.CARTA[i]); };
      if (reduce || !window.gsap || !panel.firstElementChild || panel.firstElementChild.tagName === "NOSCRIPT") { pinta(); return; }
      gsap.to(panel, { autoAlpha: 0, y: 8, duration: 0.16, ease: "power2.in", onComplete: function () {
        pinta();
        gsap.fromTo(panel, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" });
        gsap.fromTo($$(".plato", panel).slice(0, 14), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.025, ease: "power3.out" });
      } });
    }
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest(".pestana"); if (!b) return;
      var i = +b.getAttribute("data-i"); if (i === actual) return;
      muestra(i);
      var top = $("#carta").querySelector(".carta-pestanas").getBoundingClientRect().top;
      if (top < 0) window.scrollTo({ top: window.scrollY + top - 70, behavior: reduce ? "auto" : "smooth" });
    });
    tabs.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var n = window.CARTA.length;
      muestra((actual + (e.key === "ArrowRight" ? 1 : n - 1)) % n, true);
    });
    panel.innerHTML = htmlCategoria(window.CARTA[0]);
  }

  /* ---------- Navegación: se oscurece al salir de la portada ---------- */
  function enlazaNav() {
    var nav = $("[data-nav]");
    var cambia = function () { if (window.scrollY > window.innerHeight * 0.7) nav.setAttribute("data-solida", ""); else nav.removeAttribute("data-solida"); };
    window.addEventListener("scroll", cambia, { passive: true }); cambia();
  }

  /* ---------- Movimiento ---------- */
  function movimiento() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0); // las entradas van por tiempo real aunque el 3D cargue el procesador
    var mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", function () {
      // La portada: el nombre sube línea a línea mientras se encienden las lámparas.
      gsap.from(".portada-titulo .linea > span", { yPercent: 110, duration: 1.3, ease: "power4.out", stagger: 0.12, delay: 0.35 });
      gsap.from([".ahora", ".portada-frase", ".portada-pie .acciones", ".luz-control"], { autoAlpha: 0, y: 16, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.9 });
      // Al bajar, el texto de la portada se va antes que el techo.
      gsap.to(".portada-texto", { yPercent: -18, autoAlpha: 0, ease: "none", scrollTrigger: { trigger: ".portada", start: "top top", end: "bottom 25%", scrub: 0.5 } });
      // Entradas de cada sección, una vez.
      var revela = $$("[data-revela]");
      gsap.set(revela, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(revela, { start: "top 88%", once: true, onEnter: function (els) {
        gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true });
      } });
      // El precio del menú cuenta hasta su valor.
      return function () {};
    });
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  pintaAhora(); setInterval(pintaAhora, 60000);
  cargaMenu();
  montaCarta();
  enlazaNav();
  movimiento();
})();
