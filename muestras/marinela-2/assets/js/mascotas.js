// Los muñequitos de la carta, redibujados en SVG al estilo de los dibujos
// animados de los años 30: brazos de goma, guantes blancos y ojos de "tarta".
// Cada uno se pinta en <div class="mascota" data-m="burger"></div>.
(function () {
  var T = "#111a15", SC = "#b8d0c5", S = "#8aa89a", B = "#22352b", Q = "#f2b42c", W = "#ffffff", L = "#6f9a7f";
  var sw = 'stroke="' + T + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';

  function guante(x, y, giro) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + giro + ')">' +
      '<rect x="-11" y="10" width="22" height="9" rx="4" fill="' + W + '" ' + sw + '/>' +
      '<path d="M-13 8 C-17 -6 -9 -16 0 -15 C9 -16 17 -6 13 8 Z" fill="' + W + '" ' + sw + '/>' +
      '<path d="M-4 -2 L-4 6 M4 -2 L4 6" stroke="' + T + '" stroke-width="3" stroke-linecap="round"/>' +
      '</g>';
  }

  // Brazo de goma: sale del hombro y se curva hasta el guante.
  function brazo(lado, hx, hy, saludo) {
    var s = lado === "i" ? -1 : 1;
    var gx = hx + s * 34, gy = hy - (saludo ? 46 : -26);
    var c1x = hx + s * 26, c1y = hy + (saludo ? 4 : 2);
    return '<g class="m-brazo m-brazo-' + lado + (saludo ? " m-saluda" : "") + '" style="transform-origin:' + hx + 'px ' + hy + 'px">' +
      '<path d="M' + hx + ' ' + hy + ' Q' + c1x + ' ' + c1y + ' ' + gx + ' ' + (gy + 12) + '" fill="none" stroke="' + T + '" stroke-width="7" stroke-linecap="round"/>' +
      guante(gx, gy, saludo ? s * 12 : s * 160) + '</g>';
  }

  function piernas(y, sep) {
    var a = 100 - sep, b = 100 + sep;
    return '<g class="m-piernas">' +
      '<path d="M' + a + ' ' + y + ' Q' + (a - 4) + ' ' + (y + 26) + ' ' + (a - 8) + ' ' + (y + 46) + '" fill="none" stroke="' + T + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + b + ' ' + y + ' Q' + (b + 4) + ' ' + (y + 26) + ' ' + (b + 8) + ' ' + (y + 46) + '" fill="none" stroke="' + T + '" stroke-width="7" stroke-linecap="round"/>' +
      '<ellipse cx="' + (a - 18) + '" cy="' + (y + 52) + '" rx="22" ry="11" fill="' + T + '"/>' +
      '<ellipse cx="' + (b + 18) + '" cy="' + (y + 52) + '" rx="22" ry="11" fill="' + T + '"/>' +
      '<ellipse cx="' + (a - 24) + '" cy="' + (y + 48) + '" rx="7" ry="3" fill="' + W + '" opacity=".55"/>' +
      '<ellipse cx="' + (b + 12) + '" cy="' + (y + 48) + '" rx="7" ry="3" fill="' + W + '" opacity=".55"/>' +
      '</g>';
  }

  // Ojos de tarta (pie-cut eyes) y sonrisa grande.
  function cara(cx, cy, esc) {
    esc = esc || 1;
    var o = function (x) {
      return '<ellipse cx="' + x + '" cy="' + cy + '" rx="' + 9 * esc + '" ry="' + 13 * esc + '" fill="' + W + '" ' + sw + '/>' +
        '<g class="m-pupila"><ellipse cx="' + (x + 1.5 * esc) + '" cy="' + (cy + 3 * esc) + '" rx="' + 5 * esc + '" ry="' + 8.5 * esc + '" fill="' + T + '"/>' +
        '<path d="M' + (x + 1.5 * esc) + ' ' + (cy + 1 * esc) + ' L' + (x + 7 * esc) + ' ' + (cy - 5 * esc) + ' L' + (x + 7 * esc) + ' ' + (cy + 1 * esc) + ' Z" fill="' + W + '"/></g>';
    };
    var my = cy + 20 * esc, mw = 17 * esc;
    return '<g class="m-cara">' + o(cx - 15 * esc) + o(cx + 15 * esc) +
      '<path d="M' + (cx - mw) + ' ' + my + ' Q' + cx + ' ' + (my + 22 * esc) + ' ' + (cx + mw) + ' ' + my + ' Q' + cx + ' ' + (my + 8 * esc) + ' ' + (cx - mw) + ' ' + my + ' Z" fill="' + T + '" ' + sw + '/>' +
      '<path d="M' + (cx - 7 * esc) + ' ' + (my + 11 * esc) + ' Q' + cx + ' ' + (my + 6 * esc) + ' ' + (cx + 7 * esc) + ' ' + (my + 11 * esc) + ' Q' + cx + ' ' + (my + 16 * esc) + ' ' + (cx - 7 * esc) + ' ' + (my + 11 * esc) + ' Z" fill="' + Q + '"/>' +
      '</g>';
  }

  var cuerpos = {
    burger: function () {
      return piernas(176, 26) + brazo("i", 36, 136, false) + brazo("d", 164, 136, true) +
        '<rect x="30" y="150" width="140" height="28" rx="12" fill="' + SC + '" ' + sw + '/>' +
        '<path d="M26 138 Q40 128 52 140 Q64 130 76 140 Q88 130 100 140 Q112 130 124 140 Q136 130 148 140 Q160 130 174 138 L174 150 L26 150 Z" fill="' + L + '" ' + sw + '/>' +
        '<rect x="28" y="122" width="144" height="26" rx="12" fill="' + B + '" ' + sw + '/>' +
        '<path d="M28 118 L172 118 L162 136 Q150 146 140 128 Q128 150 112 128 Q100 146 84 128 Q70 150 58 128 Q46 144 36 128 Z" fill="' + Q + '" ' + sw + '/>' +
        '<path d="M26 120 Q26 46 100 46 Q174 46 174 120 Z" fill="' + SC + '" ' + sw + '/>' +
        '<g fill="' + W + '" stroke="' + T + '" stroke-width="2.5"><ellipse cx="62" cy="66" rx="5" ry="3" transform="rotate(-20 62 66)"/><ellipse cx="140" cy="68" rx="5" ry="3" transform="rotate(25 140 68)"/><ellipse cx="100" cy="56" rx="5" ry="3"/><ellipse cx="48" cy="96" rx="5" ry="3" transform="rotate(-35 48 96)"/><ellipse cx="154" cy="98" rx="5" ry="3" transform="rotate(35 154 98)"/></g>' +
        cara(100, 80, 0.95);
    },
    perrito: function () {
      return piernas(182, 24) + brazo("i", 30, 146, true) + brazo("d", 170, 146, false) +
        '<rect x="8" y="88" width="184" height="40" rx="20" fill="' + B + '" ' + sw + '/>' +
        '<path d="M30 100 L48 112 L66 100 L84 112 L102 100 L120 112 L138 100 L156 112 L172 100" fill="none" stroke="' + Q + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M20 112 Q20 186 100 186 Q180 186 180 112 Q140 128 100 128 Q60 128 20 112 Z" fill="' + SC + '" ' + sw + '/>' +
        cara(100, 146, 0.8);
    },
    sandwich: function () {
      return piernas(178, 24) + brazo("i", 44, 140, false) + brazo("d", 156, 140, true) +
        '<path d="M28 176 Q24 168 30 160 L94 46 Q100 36 106 46 L170 160 Q176 168 172 176 Z" fill="' + B + '" ' + sw + '/>' +
        '<path d="M44 168 L100 66 L156 168 Z" fill="' + SC + '" stroke="' + SC + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M26 176 Q38 166 50 178 Q62 166 74 178 Q86 166 100 178 Q114 166 126 178 Q138 166 150 178 Q162 166 174 176" fill="none" stroke="' + L + '" stroke-width="8" stroke-linecap="round"/>' +
        cara(100, 120, 0.82);
    },
    tarta: function () {
      return piernas(180, 26) + brazo("i", 34, 138, true) + brazo("d", 166, 138, false) +
        '<path d="M26 92 L174 70 L174 180 L26 180 Z" fill="' + SC + '" ' + sw + '/>' +
        '<path d="M26 128 L174 128" stroke="' + B + '" stroke-width="14"/>' +
        '<path d="M26 92 L174 70 L174 180 L26 180 Z" fill="none" ' + sw + '/>' +
        '<path d="M22 94 Q36 108 50 92 Q64 106 78 88 Q92 102 106 84 Q120 98 134 80 Q148 94 162 76 Q172 86 178 70 L174 66 L22 90 Z" fill="' + W + '" ' + sw + '/>' +
        '<circle cx="132" cy="58" r="13" fill="' + Q + '" ' + sw + '/>' +
        '<path d="M134 46 Q140 32 152 30" fill="none" stroke="' + T + '" stroke-width="4" stroke-linecap="round"/>' +
        cara(100, 148, 0.75);
    },
    botella: function () {
      return piernas(204, 22) + brazo("i", 62, 148, false) + brazo("d", 138, 148, true) +
        '<rect x="84" y="10" width="32" height="18" rx="4" fill="' + Q + '" ' + sw + '/>' +
        '<path d="M88 28 L112 28 L112 64 Q140 80 140 112 L140 196 Q140 206 130 206 L70 206 Q60 206 60 196 L60 112 Q60 80 88 64 Z" fill="' + B + '" ' + sw + '/>' +
        '<rect x="66" y="118" width="68" height="70" rx="8" fill="' + W + '" ' + sw + '/>' +
        '<path d="M70 60 Q66 90 70 104" fill="none" stroke="' + W + '" stroke-width="5" stroke-linecap="round" opacity=".5"/>' +
        cara(100, 142, 0.72);
    },
    taza: function () {
      return '<g class="m-vapor" fill="none" stroke="' + W + '" stroke-width="6" stroke-linecap="round">' +
        '<path d="M76 66 Q66 52 76 40 Q86 28 76 14"/><path d="M100 60 Q90 46 100 34 Q110 22 100 8"/><path d="M124 66 Q114 52 124 40 Q134 28 124 14"/></g>' +
        piernas(178, 26) + brazo("i", 42, 120, true) +
        '<path d="M150 104 Q184 100 184 128 Q184 156 148 152" fill="none" stroke="' + T + '" stroke-width="16" stroke-linecap="round"/>' +
        '<path d="M150 104 Q184 100 184 128 Q184 156 148 152" fill="none" stroke="' + W + '" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M38 82 L162 82 L154 160 Q152 178 132 178 L68 178 Q48 178 46 160 Z" fill="' + W + '" ' + sw + '/>' +
        '<path d="M38 82 L162 82 L160 100 L40 100 Z" fill="' + B + '" ' + sw + '/>' +
        cara(100, 126, 0.85);
    },
    plato: function () {
      return piernas(170, 30) + brazo("i", 30, 132, false) + brazo("d", 170, 132, true) +
        '<g fill="' + Q + '" ' + sw + '><ellipse cx="70" cy="92" rx="22" ry="15" transform="rotate(-15 70 92)"/><ellipse cx="128" cy="90" rx="22" ry="15" transform="rotate(12 128 90)"/><ellipse cx="100" cy="76" rx="22" ry="15"/></g>' +
        '<path d="M20 104 L180 104 Q176 172 100 172 Q24 172 20 104 Z" fill="' + B + '" ' + sw + '/>' +
        '<rect x="12" y="98" width="176" height="14" rx="7" fill="' + S + '" ' + sw + '/>' +
        '<path d="M22 112 Q4 112 8 126" fill="none" stroke="' + T + '" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M178 112 Q196 112 192 126" fill="none" stroke="' + T + '" stroke-width="6" stroke-linecap="round"/>' +
        '<ellipse cx="100" cy="138" rx="44" ry="30" fill="' + SC + '"/>' +
        cara(100, 130, 0.72);
    }
  };

  window.pintaMascotas = function (raiz) {
    (raiz || document).querySelectorAll(".mascota[data-m]").forEach(function (el) {
      var tipo = el.getAttribute("data-m");
      if (!cuerpos[tipo] || el.firstChild) return;
      el.innerHTML = '<svg viewBox="-26 -6 252 272" aria-hidden="true" focusable="false"><g class="m-boil"><g class="m-salto">' + cuerpos[tipo]() + '</g></g></svg>';
    });
  };
  window.pintaMascotas();
})();
