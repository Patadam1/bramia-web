(function () {
  "use strict";

  // Enlace CSV de la hoja de Google donde caen las respuestas del formulario
  // del menú del día (Archivo › Compartir › Publicar en la web › CSV).
  // Mientras esté vacío se enseña el menú de ejemplo.
  var MENU_HOJA = "";

  var TELEFONO_WA = "34600278770";
  var HORARIO = { 0: [9, 24], 1: [9, 23], 2: null, 3: [9, 23], 4: [9, 23], 5: [9, 24], 6: [9, 24] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euros = function (n) { return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; };
  var esc = function (t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
  var MAS = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>';
  var MENOS = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h16" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>';

  // Sellos redondos como los de su carta impresa, a tinta negra.
  var SELLOS = {
    nuevo: { t: "Nuevo", svg: '<circle cx="30" cy="30" r="26" fill="#b8d0c5" stroke="#111a15" stroke-width="4"/><circle cx="30" cy="30" r="19" fill="none" stroke="#111a15" stroke-width="2" stroke-dasharray="3 3"/><text x="30" y="36" text-anchor="middle" font-family="Abril Fatface, serif" font-size="15" textLength="31" lengthAdjust="spacingAndGlyphs" fill="#111a15">NEW!</text>' },
    casa: { t: "Recomendado", svg: '<defs><path id="sello-arco" d="M30 30 m-20.5 0 a20.5 20.5 0 1 1 41 0 a20.5 20.5 0 1 1 -41 0"/></defs><circle cx="30" cy="30" r="28" fill="#111a15"/><text font-family="Albert Sans, sans-serif" font-weight="800" font-size="9" fill="#ffffff"><textPath href="#sello-arco" textLength="124" lengthAdjust="spacing">RECOMENDADO ·</textPath></text><path d="M30 21 l2.6 5.6 6 .7 -4.5 4.1 1.2 6 -5.3 -3 -5.3 3 1.2 -6 -4.5 -4.1 6 -.7z" fill="#b8d0c5"/>' },
    pica: { t: "Pica", svg: '<circle cx="30" cy="30" r="26" fill="#f4f7f5" stroke="#111a15" stroke-width="4"/><path d="M22 40 C18 30 26 20 36 19 C40 19 42 22 40 24 C34 26 30 32 28 41 C27 44 23 44 22 40Z" fill="#22352b" stroke="#111a15" stroke-width="2.5" stroke-linejoin="round"/><path d="M37 19 C38 15 41 13 44 13" fill="none" stroke="#111a15" stroke-width="3" stroke-linecap="round"/>' }
  };
  var nSello = 0;
  var sello = function (k) { nSello++; return '<span class="sello" role="img" aria-label="' + SELLOS[k].t + '" title="' + SELLOS[k].t + '"><svg viewBox="0 0 60 60" aria-hidden="true" focusable="false">' + SELLOS[k].svg.replace(/sello-arco/g, "sello-arco-" + nSello) + '</svg></span>'; };
  var sellosDe = function (p) { return (p.nuevo ? sello("nuevo") : "") + (p.casa ? sello("casa") : "") + (p.pica ? sello("pica") : ""); };
  var CAMARA = '<svg viewBox="0 0 48 40" aria-hidden="true" focusable="false"><path d="M6 10h9l4-6h10l4 6h9a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z" fill="#111a15"/><circle cx="24" cy="23" r="9" fill="#b8d0c5"/><circle cx="24" cy="23" r="4.5" fill="#111a15"/></svg>';

  // Hora de Mota del Cuervo, venga de donde venga quien mira la web.
  function ahoraMadrid() {
    var partes = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    var v = {}; partes.forEach(function (p) { v[p.type] = p.value; });
    var dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(v.weekday);
    return { dia: dia, hora: (+v.hour % 24) + (+v.minute) / 60, fecha: v.year + "-" + v.month + "-" + v.day, d: +v.day, m: +v.month - 1 };
  }
  var hhmm = function (h) { return (h === 24 ? "24" : h) + ":00"; };

  /* ---------- Abierto ahora ---------- */
  function pintaEstado() {
    var a = ahoraMadrid(), hoy = HORARIO[a.dia], caja = $("[data-estado]"), txt = $("[data-estado-texto]");
    var fila = $('[data-horario] tr[data-dia="' + a.dia + '"]');
    if (fila) fila.setAttribute("data-hoy", "");
    var abierto = hoy && a.hora >= hoy[0] && a.hora < hoy[1];
    var mensaje;
    if (abierto) mensaje = "Abierto ahora · hoy hasta las " + hhmm(hoy[1]);
    else if (hoy && a.hora < hoy[0]) mensaje = "Hoy abrimos a las " + hhmm(hoy[0]);
    else {
      var sig = (a.dia + 1) % 7, salto = 1;
      while (!HORARIO[sig]) { sig = (sig + 1) % 7; salto++; }
      var cuando = salto === 1 ? "mañana" : "el " + DIAS[sig];
      mensaje = (a.dia === 2 ? "Los martes descansamos" : "Ahora cerrado") + " · abrimos " + cuando + " a las " + hhmm(HORARIO[sig][0]);
    }
    caja.setAttribute("data-abierto", abierto ? "1" : "0");
    txt.textContent = mensaje;
  }

  /* ---------- La comanda ---------- */
  var comanda = [];
  try { comanda = JSON.parse(localStorage.getItem("marinela-comanda") || "[]"); } catch (e) { comanda = []; }
  function guarda() { try { localStorage.setItem("marinela-comanda", JSON.stringify(comanda)); } catch (e) {} }

  function anade(nombre, precio, origen) {
    var linea = comanda.filter(function (l) { return l.n === nombre; })[0];
    if (linea) linea.c++; else comanda.push({ n: nombre, p: precio, c: 1 });
    guarda(); pintaComanda(); vuela(origen);
  }

  function pintaComanda() {
    var lista = $("[data-ticket]"), total = 0, piezas = 0;
    lista.innerHTML = comanda.map(function (l, i) {
      total += l.p * l.c; piezas += l.c;
      return '<li class="ticket-linea"><span class="ticket-nombre">' + esc(l.n) + '</span>' +
        '<span class="ticket-mando"><button type="button" data-menos="' + i + '" aria-label="Quitar uno de ' + esc(l.n) + '">' + MENOS + '</button><output>' + l.c + '</output>' +
        '<button type="button" data-mas="' + i + '" aria-label="Añadir otro de ' + esc(l.n) + '">' + MAS + '</button></span>' +
        '<span class="ticket-precio">' + euros(l.p * l.c) + '</span></li>';
    }).join("");
    $("[data-ticket-vacio]").hidden = comanda.length > 0;
    $("[data-ticket-total]").textContent = euros(total);
    $$("[data-contador]").forEach(function (c) { c.textContent = piezas; });
    var flot = $("[data-flotante]");
    if (piezas > 0 && !enComanda) flot.setAttribute("data-visible", ""); else flot.removeAttribute("data-visible");
    $$("[data-anadir]").forEach(function (b) {
      var l = comanda.filter(function (x) { return x.n === b.getAttribute("data-anadir"); })[0];
      if (l) b.setAttribute("data-cuantos", l.c); else b.removeAttribute("data-cuantos");
    });
  }

  // Una ficha redonda vuela del plato a la comanda.
  function vuela(origen) {
    if (!origen || reduce || !window.gsap) return;
    var destino = window.innerWidth <= 700 ? $(".movil-comanda .contador") : $("[data-flotante] .contador");
    if (!destino) return;
    var a = origen.getBoundingClientRect(), b = destino.getBoundingClientRect();
    var f = document.createElement("span");
    f.className = "ficha"; f.style.left = a.left + "px"; f.style.top = a.top + "px";
    document.body.appendChild(f);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    gsap.timeline({ onComplete: function () { f.remove(); } })
      .to(f, { x: dx, duration: 0.55, ease: "power1.inOut" }, 0)
      .to(f, { y: dy, duration: 0.55, ease: "back.in(1.6)" }, 0)
      .to(f, { scale: 0.45, autoAlpha: 0.2, duration: 0.2, ease: "power2.in" }, 0.37)
      .fromTo(destino, { scale: 1 }, { scale: 1.35, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }, 0.5);
  }

  // El botón flotante se aparta cuando ya estás mirando la comanda.
  var enComanda = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { enComanda = es[0].isIntersecting; pintaComanda(); }, { threshold: 0.15 }).observe(document.getElementById("comanda"));
  }

  function enlazaComanda() {
    $("[data-ticket]").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var i = +(b.getAttribute("data-menos") || b.getAttribute("data-mas"));
      if (b.hasAttribute("data-menos")) { comanda[i].c--; if (comanda[i].c <= 0) comanda.splice(i, 1); }
      else comanda[i].c++;
      guarda(); pintaComanda();
    });
    $("[data-comanda-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      var ayuda = $("[data-comanda-ayuda]"), f = e.target;
      if (!comanda.length) { ayuda.textContent = "La comanda está vacía: añade algo de la carta o del menú del día."; return; }
      if (!f.nombre.value.trim() || !f.hora.value) { ayuda.textContent = "Pon tu nombre y la hora a la que pasas a recogerlo."; (f.nombre.value.trim() ? f.hora : f.nombre).focus(); return; }
      var total = 0;
      var lineas = comanda.map(function (l) { total += l.p * l.c; return "• " + l.c + " × " + l.n + " (" + euros(l.p * l.c) + ")"; });
      var texto = "Hola, quiero pedir para recoger en El Rincón de Marinela:\n\n" + lineas.join("\n") +
        "\n\nTotal aproximado: " + euros(total) + "\nA nombre de: " + f.nombre.value.trim() + "\nPaso a recogerlo a las " + f.hora.value + ".\n\nGracias.";
      ayuda.textContent = "Abriendo WhatsApp con tu comanda…";
      window.open("https://wa.me/" + TELEFONO_WA + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    });
  }

  /* ---------- La carta ---------- */
  function filaPlato(p, extraClase, extraAttr) {
    var nombre = (p.num ? '<span class="plato-num">' + p.num + '</span>' : "") + esc(p.n) +
      (p.confirmar ? '<span class="plato-confirmar">(nombre por confirmar)</span>' : "");
    var sellos = sellosDe(p);
    var boton = typeof p.p === "number"
      ? '<button type="button" class="anadir" data-anadir="' + esc(p.n) + '" data-precio="' + p.p + '" aria-label="Añadir ' + esc(p.n) + ' a la comanda">' + MAS + '</button>'
      : '<span class="anadir-hueco" aria-hidden="true"></span>';
    return '<li class="plato' + (extraClase || "") + '"' + (extraAttr || "") + '>' + boton +
      '<span class="plato-nombre">' + nombre + '</span>' +
      '<span class="plato-precio">' + (typeof p.p === "number" ? euros(p.p) : esc(p.texto)) + '</span>' +
      (p.d ? '<span class="plato-desc">' + esc(p.d) + '</span>' : "") +
      (sellos ? '<span class="plato-sellos">' + sellos + '</span>' : "") + '</li>';
  }

  function pintaCarta() {
    var cuerpo = $("[data-carta]"), nav = $("[data-carta-nav]");
    var html = "", enlaces = "";
    window.CARTA.forEach(function (cat) {
      var cuantos = cat.grupos.reduce(function (n, g) { return n + g.platos.length; }, 0);
      enlaces += '<a href="#c-' + cat.id + '">' + esc(cat.corto || cat.nombre) + '</a>';
      html += '<section class="categoria marco" id="c-' + cat.id + '" aria-labelledby="t-' + cat.id + '">' +
        '<div class="cat-cabeza" data-entra>' +
        (cat.id === "burgers" ? "" : '<div class="mascota cat-mascota" data-m="' + cat.mascota + '"></div>') +
        (cat.hueco ? '<div class="circulo hueco-foto cat-hueco" role="img" aria-label="Foto pendiente: ' + esc(cat.hueco) + '">' + CAMARA + '<strong>Foto pendiente</strong><span>' + esc(cat.hueco) + '</span></div>' : "") +
        (cat.foto ? '<figure class="cat-foto"><img src="' + cat.foto.src + '" alt="' + esc(cat.foto.alt) + '" width="382" height="510"></figure>' : "") +
        '<h3 class="cat-titulo" id="t-' + cat.id + '">' + esc(cat.nombre) + '</h3>' +
        '<p class="cat-cuenta">' + cuantos + ' platos</p></div>' +
        (cat.nota ? '<p class="cat-nota" data-entra>' + esc(cat.nota) + '</p>' : "");
      if (cat.id === "burgers") {
        var primera = cat.grupos[0].platos[0];
        html += '<div class="escaparate"><div class="escaparate-escena" data-entra>' +
          '<div class="escaparate-disco" data-escaparate data-tipo="' + esc(cat.grupos[0].nombre) + '" aria-live="polite">' +
          '<p class="escaparate-num" data-e-num>' + primera.num + '</p><p class="escaparate-nombre" data-e-nombre>' + esc(primera.n) + '</p>' +
          '<p class="escaparate-desc" data-e-desc>' + esc(primera.d) + '</p><p class="escaparate-precio" data-e-precio>' + euros(primera.p) + '</p><div class="escaparate-sellos" data-e-sellos>' + sellosDe(primera) + '</div></div>' +
          '<div class="mascota escaparate-mascota" data-m="burger" data-e-mascota></div></div>' +
          '<div class="escaparate-lista">' + cat.grupos.map(function (g) {
            return '<div class="grupo" data-entra><h4 class="grupo-titulo">' + esc(g.nombre) + '</h4><ul class="platos">' +
              g.platos.map(function (p) {
                return filaPlato(p, " plato-burger", ' data-burger="' + p.num + '" data-tipo="' + esc(g.nombre) + '"' + (p.num === 1 ? ' aria-current="true"' : ""));
              }).join("") + '</ul></div>';
          }).join("") + '</div></div>';
      } else {
        html += cat.grupos.map(function (g) {
          return '<div class="grupo" data-entra><h4 class="grupo-titulo">' + esc(g.nombre) + '</h4><ul class="platos">' +
            g.platos.map(function (p) { return filaPlato(p); }).join("") + '</ul></div>';
        }).join("");
      }
      html += '</section>';
    });
    cuerpo.innerHTML = html;
    nav.innerHTML = enlaces;
    window.pintaMascotas(cuerpo);

    cuerpo.addEventListener("click", function (e) {
      var b = e.target.closest("[data-anadir]");
      if (b) { anade(b.getAttribute("data-anadir"), +b.getAttribute("data-precio"), b); return; }
      var fila = e.target.closest("[data-burger]");
      if (fila) eligeBurger(fila);
    });
    cuerpo.addEventListener("mouseover", function (e) {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      var fila = e.target.closest("[data-burger]"); if (fila) eligeBurger(fila);
    });

    // La parte de la carta en la que estás se marca en la tira de arriba.
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          $$("a", nav).forEach(function (a) {
            var si = a.getAttribute("href") === "#" + en.target.id;
            a.setAttribute("aria-current", si ? "true" : "false");
            if (si && nav.scrollTo) nav.scrollTo({ left: a.offsetLeft - 16, behavior: reduce ? "auto" : "smooth" });
          });
        });
      }, { rootMargin: "-30% 0px -60% 0px" });
      $$(".categoria", cuerpo).forEach(function (s) { io.observe(s); });
    }
  }

  var burgerActual = "1";
  function eligeBurger(fila) {
    var num = fila.getAttribute("data-burger");
    if (num === burgerActual) return;
    burgerActual = num;
    var p; window.CARTA.forEach(function (c) { c.grupos.forEach(function (g) { g.platos.forEach(function (x) { if (String(x.num) === num && c.id === "burgers") p = x; }); }); });
    $$("[data-burger]").forEach(function (f) { f.setAttribute("aria-current", f === fila ? "true" : "false"); });
    var disco = $("[data-escaparate]");
    var cambia = function () {
      disco.setAttribute("data-tipo", fila.getAttribute("data-tipo"));
      $("[data-e-num]").textContent = p.num;
      $("[data-e-nombre]").textContent = p.n;
      $("[data-e-desc]").textContent = p.d || "";
      $("[data-e-precio]").textContent = euros(p.p);
      $("[data-e-sellos]").innerHTML = sellosDe(p);
    };
    if (reduce || !window.gsap) { cambia(); return; }
    var textos = $$("[data-e-num], [data-e-nombre], [data-e-desc], [data-e-precio], [data-e-sellos]");
    gsap.killTweensOf(textos);
    gsap.to(textos, { autoAlpha: 0, y: -6, duration: 0.12, ease: "power2.in", onComplete: function () {
      cambia();
      gsap.fromTo(textos, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.04, ease: "power3.out" });
    } });
    // El muñeco da un saltito cada vez que cambias de burger.
    gsap.fromTo("[data-e-mascota]", { scaleY: 0.86, scaleX: 1.08, transformOrigin: "50% 100%" }, { scaleY: 1, scaleX: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
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

  function pintaMenu(m, origen) {
    var form = $("[data-menu-form]");
    var real = origen === "hoja";
    var opcion = function (nombre, grupo) {
      if (!real) return '<li class="opcion opcion-fija"><span class="anilla" aria-hidden="true"></span><span>' + esc(nombre) + '</span></li>';
      return '<li><label class="opcion"><input type="radio" name="' + grupo + '" value="' + esc(nombre) + '"><span class="anilla" aria-hidden="true"></span><span>' + esc(nombre) + '</span></label></li>';
    };
    // Con el menú de ejemplo no se puede pedir: solo preguntar el de hoy.
    $("[data-menu-anadir]").hidden = !real;
    $("[data-menu-preguntar]").hidden = real;
    $("[data-menu-ayuda]").textContent = real
      ? "Para llevar: elige un primero y un segundo. Para comer aquí, reserva por WhatsApp o llama."
      : "Para comer aquí, reserva por WhatsApp o llama. También se puede pedir para llevar.";
    $("[data-menu-primeros]").innerHTML = m.primeros.map(function (x) { return opcion(x, "primero"); }).join("");
    $("[data-menu-segundos]").innerHTML = m.segundos.map(function (x) { return opcion(x, "segundo"); }).join("");
    $$("[data-menu-precio]").forEach(function (e) { e.textContent = euros(m.precio); });
    var f = $("[data-menu-fecha]"), a = ahoraMadrid();
    if (origen === "hoja" && m.fecha) {
      var d = m.fecha;
      var esHoy = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") === a.fecha;
      f.textContent = (esHoy ? "Hoy, " : "Último menú publicado: ") + DIAS[d.getDay()] + " " + d.getDate() + " de " + MESES[d.getMonth()] + ". Primero, segundo y postre o café.";
    } else {
      f.textContent = "Así es un menú de la casa, de ejemplo. Cambia cada día: pregunta el de hoy.";
    }
    form.menuPrecio = m.precio;
  }

  function cargaMenu() {
    pintaMenu(window.MENU_EJEMPLO, "ejemplo");
    if (!MENU_HOJA) return;
    fetch(MENU_HOJA + (MENU_HOJA.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now()).then(function (r) { return r.text(); }).then(function (t) {
      var filas = parseCSV(t).filter(function (f) { return f.length >= 4 && f[1]; });
      var u = filas[filas.length - 1]; if (!u || filas.length < 2) return;
      // Columnas del formulario: Marca temporal, Primeros, Segundos, Precio
      var partes = u[0].match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      var fecha = partes ? new Date(+partes[3], +partes[2] - 1, +partes[1]) : null;
      var precio = parseFloat(String(u[3]).replace(",", ".").replace(/[^\d.]/g, "")) || window.MENU_EJEMPLO.precio;
      var m = { primeros: lineas(u[1]), segundos: lineas(u[2]), precio: precio, fecha: fecha };
      if (m.primeros.length && m.segundos.length) pintaMenu(m, "hoja");
    }).catch(function () {});
  }

  function enlazaMenu() {
    var form = $("[data-menu-form]"), ayuda = $("[data-menu-ayuda]");
    $("[data-menu-anadir]").addEventListener("click", function (e) {
      var p = form.querySelector('input[name="primero"]:checked'), s = form.querySelector('input[name="segundo"]:checked');
      if (!p || !s) {
        ayuda.setAttribute("data-aviso", "");
        ayuda.textContent = !p && !s ? "Elige un primero y un segundo." : (!p ? "Te falta elegir el primero." : "Te falta elegir el segundo.");
        return;
      }
      ayuda.removeAttribute("data-aviso");
      anade("Menú del día: " + p.value + " + " + s.value, form.menuPrecio, e.currentTarget);
      ayuda.textContent = "Apuntado en tu comanda. Puedes añadir otro menú o algo de la carta.";
      p.checked = false; s.checked = false;
    });
  }

  /* ---------- Movimiento ---------- */
  function movimiento() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", function () {
      // 1. El iris se abre sobre el cartel, como al empezar un dibujo animado.
      var iris = $("[data-iris-portada]");
      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(iris, { clipPath: "circle(0% at 50% 40%)" }, { clipPath: "circle(110% at 50% 40%)", duration: 1.15, ease: "power2.inOut" })
        .from(".portada-logo", { scale: 0.86, autoAlpha: 0, duration: 0.7 }, 0.45)
        .from(".mascota-izq", { xPercent: -60, autoAlpha: 0, duration: 0.7, ease: "back.out(1.8)" }, 0.75)
        .from(".mascota-der", { xPercent: 60, autoAlpha: 0, duration: 0.7, ease: "back.out(1.8)" }, 0.85)
        .from([".portada-linea", ".portada-texto", ".estado", ".acciones", ".portada-menu"], { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.07 }, 0.8)
        .add(function () { iris.style.clipPath = "none"; });

      // Al bajar, los anillos crecen y el cartel se aleja.
      gsap.set(".anillos", { x: 0, y: 0, xPercent: -50, yPercent: -50 });
      gsap.to(".anillos", { scale: 1.35, ease: "none", scrollTrigger: { trigger: ".portada", start: "top top", end: "bottom top", scrub: 0.6 } });

      // 2. Cada acto se abre con el iris al entrar en pantalla (una sola vez).
      $$("[data-iris]").forEach(function (sec) {
        if (sec.getBoundingClientRect().top < window.innerHeight * 0.85) return;
        gsap.set(sec, { clipPath: "circle(6% at 50% 40%)" });
        ScrollTrigger.create({
          trigger: sec, start: "top 85%", once: true,
          onEnter: function () {
            gsap.to(sec, { clipPath: "circle(75% at 50% 40%)", duration: 1, ease: "power2.inOut", onComplete: function () { sec.style.clipPath = "none"; } });
          }
        });
      });

      // 3. Entradas: título, texto y foto, por turnos.
      var entran = $$("[data-entra]");
      gsap.set(entran, { y: 24, autoAlpha: 0 });
      ScrollTrigger.batch(entran, {
        start: "top 88%", once: true,
        onEnter: function (els) { gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: true }); }
      });

      // 4. La palabra "Llama" sube desde abajo al llegar a la banda.
      gsap.from(".llama-palabra", { yPercent: 70, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".llama", start: "top 70%", once: true } });

      // 5. Los molinos giran despacio dentro de su disco.
      gsap.fromTo(".llegar-disco img", { scale: 1.25 }, { scale: 1.08, ease: "none", scrollTrigger: { trigger: ".llegar", start: "top bottom", end: "bottom top", scrub: 0.6 } });

      return function () { $$("[data-iris]").forEach(function (s) { s.style.clipPath = ""; }); };
    });
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  /* ---------- Anillos en pantallas estrechas: el disco rodea el cartel ---------- */
  var estrecha = window.matchMedia("(max-width: 1200px), (max-aspect-ratio: 5/4)");
  function colocaAnillos() {
    var an = $(".anillos"), iris = $(".iris"), t = $(".portada-titulo"), txt = $(".portada-texto");
    txt.style.marginTop = "";
    if (!estrecha.matches) { an.style.left = an.style.top = an.style.width = ""; return; }
    var ri = iris.getBoundingClientRect(), rt = t.getBoundingClientRect();
    var diag = Math.sqrt(rt.width * rt.width + rt.height * rt.height) * 1.04;
    var ancho = diag / 0.492, cy = rt.top + rt.height / 2 - ri.top;
    an.style.left = (rt.left + rt.width / 2 - ri.left) + "px";
    an.style.top = cy + "px";
    an.style.width = Math.round(ancho) + "px";
    // El texto empieza por debajo del anillo oscuro, nunca encima.
    var bajoAnillo = cy + ancho * 0.262 + 16, tt = txt.getBoundingClientRect().top - ri.top;
    if (tt < bajoAnillo) txt.style.marginTop = (parseFloat(getComputedStyle(txt).marginTop) + bajoAnillo - tt) + "px";
  }

  /* ---------- Barra del móvil: sale cuando los botones de la portada ya no se ven ---------- */
  function enlazaBarraMovil() {
    var barra = $("[data-movil-barra]"), acciones = $(".portada .acciones");
    if (!("IntersectionObserver" in window) || !acciones) return;
    barra.setAttribute("data-oculta", "");
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) barra.setAttribute("data-oculta", ""); else barra.removeAttribute("data-oculta");
    }).observe(acciones);
  }

  /* ---------- Arranque ---------- */
  pintaEstado(); setInterval(pintaEstado, 60000);
  pintaCarta();
  cargaMenu();
  enlazaMenu();
  enlazaComanda();
  pintaComanda();
  colocaAnillos();
  window.addEventListener("resize", colocaAnillos);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(colocaAnillos);
  enlazaBarraMovil();
  movimiento();
})();
