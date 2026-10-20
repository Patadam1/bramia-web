// La carta de El Rincón de Marinela, copiada de su carta impresa.
// Para cambiar un precio o un plato, edita solo este archivo.
// nuevo: sale con la marca "Nuevo" · casa: "Recomendado de la casa" · pica: "Pica"
window.CARTA = [
  {
    id: "raciones",
    nombre: "Raciones",
    mascota: "plato",
    foto: { src: "assets/img/nachos.jpg", alt: "Nachos de la casa con cheddar, guacamole y cebolla crujiente" },
    grupos: [
      {
        nombre: "Las de toda la vida",
        platos: [
          { n: "Pincho moruno", p: 2.5 },
          { n: "Croquetas variadas", p: 10 },
          { n: "Tabla de quesos", p: 14 },
          { n: "Jamón de bodega", p: 14 },
          { n: "Torreznos", p: 11.5 },
          { n: "Calamares nacionales", p: 15 },
          { n: "Oreja", p: 10.5 },
          { n: "Alitas", p: 10 },
          { n: "Lomo de orza", p: 11, nuevo: true },
          { n: "Revuelto de ajetes y gambas", p: 11 },
          { n: "Huevos rotos", p: 10.5 },
          { n: "Sepia a la plancha", p: 12 },
          { n: "Rabas", p: 13 },
          { n: "Pulpo", p: 14.5 },
          { n: "Secreto", p: 9.5 },
          { n: "Muslo de pollo deshuesado", p: 8.5 },
          { n: "Rejos fritos", p: 13 }
        ]
      },
      {
        nombre: "Para los amantes del Rincón",
        platos: [
          { n: "Crunchy combo", p: 13, d: "Crocanti, alitas grill, solomillo kentucky y 3 salsas", nuevo: true },
          { n: "Combo El Rincón", p: 15, d: "Nuggets, alitas, tequeños, patatas y queso frito" },
          { n: "Cachopo crujiente", p: 9, nuevo: true },
          { n: "Fingers de pollo", p: 9 },
          { n: "Cono de pollo kentucky", p: 10.5, nuevo: true },
          { n: "Tequeños", p: 9.5 },
          { n: "Tequeños infernales", p: 10, d: "Tequeños con un ligero toque picante", pica: true },
          { n: "Queso frito", p: 11.5 },
          { n: "Salchipapas", p: 8 },
          { n: "Patatas fritas", p: 6 },
          { n: "Patatas bravas", p: 7.5 },
          { n: "Patatas rancheras", p: 9.5, d: "Beicon crujiente, queso fundido y salsa ranchera" },
          { n: "Patatas cochinas", p: 10.5, d: "Carne mechada a baja temperatura, bbq y queso", casa: true },
          { n: "Nachos", p: 10.5, d: "Salsa secreta, cheddar, cebolla crujiente y guacamole", casa: true, pica: true }
        ]
      }
    ]
  },
  {
    id: "burgers",
    nombre: "Burgers",
    mascota: "burger",
    hueco: "Una smash burger recién hecha, de cerca",
    nota: "Todas las hamburguesas van acompañadas de patatas. Ingrediente extra 0,50 € · huevo frito 1,00 €.",
    grupos: [
      {
        nombre: "Las de vacuno",
        platos: [
          { num: 1, n: "La de siempre", p: 8, d: "Hamburguesa de vacuno 180 g, lechuga, tomate y mayonesa" },
          { num: 2, n: "La Canalla", p: 9, d: "Carne mechada a baja temperatura, lechuga, queso cheddar y salsa bbq", casa: true },
          { num: 3, n: "Deluxe", p: 9.5, d: "Vacuno 180 g, salsa de pepinillo, lechuga, tomate, beicon crujiente, cheddar, huevo y cebolla crujiente" },
          { num: 4, n: "La Setera", p: 9, d: "Vacuno 180 g, beicon, queso tierno, cebolla caramelizada y salsa de setas" },
          { num: 5, n: "La Manchega 2.0", p: 10, d: "Vacuno 180 g, queso curado, mermelada de beicon, jamón ibérico y panceta ibérica", casa: true },
          { num: 6, n: "Um Buaé Moteña", confirmar: true, p: 10.5, d: "Hamburguesa de buey 220 g, lechuga, queso de cabra, cebolla caramelizada y salsa de pepinillos" },
          { num: 7, n: "La Pecadora", p: 12, d: "Vacuno 200 g, pan brioche rojo, mermelada de cecina, cheddar, beicon, salsa cheddar y oro comestible", nuevo: true },
          { num: 8, n: "Black Golden", p: 13, d: "Vacuno 200 g, pan brioche negro, salsa Emmy, doble cheddar, beicon, salsa de mango habanero, salsa cheddar y oro comestible", nuevo: true }
        ]
      },
      {
        nombre: "Smash",
        platos: [
          { num: 9, n: "Classic Smash", p: 8, d: "Smash de vacuno 100 g, doble queso cheddar y beicon crispy" },
          { num: 10, n: "Lotus Extreme", p: 10, d: "Doble smash de vacuno 100 g, doble cheddar, beicon crispy, crema crumble de lotus y galleta" },
          { num: 11, n: "Volcán de queso", p: 10, d: "Doble smash de vacuno 100 g, cheddar, beicon crispy, volcán de queso y cebolla crujiente", casa: true },
          { num: 12, n: "La Trufada", p: 10, d: "Doble smash de vacuno 120 g, cheddar, panceta ibérica y salsa cremosa de trufa" },
          { num: 13, n: "Pistacho", p: 10, d: "Doble smash de vacuno 100 g, doble cheddar, beicon y crema de pistacho", nuevo: true }
        ]
      },
      {
        nombre: "De pollo",
        platos: [
          { num: 14, n: "Crispy Chicken", p: 10, d: "Pollo crujiente, lechuga, tomate, mayonesa, queso, beicon y cebolla crujiente" },
          { num: 15, n: "Crispy Royale", p: 12, d: "Pollo crujiente kentucky, salsa rosa, mermelada de beicon, cheddar, beicon, patatas paja, salsa de mango habanero, salsa cheddar y sésamo", nuevo: true }
        ]
      }
    ]
  },
  {
    id: "perritos-pizzas",
    nombre: "Perritos y pizzas",
    corto: "Perritos y pizzas",
    mascota: "perrito",
    grupos: [
      {
        nombre: "Perritos",
        platos: [
          { n: "Perrito clásico", p: 5.5, d: "Pan brioche, salchicha, queso fundido, mayonesa y kétchup" },
          { n: "Perrito especial", p: 6.5, d: "Pan brioche, salchicha, queso, beicon, cebolla frita y patatas paja" },
          { n: "Perrito mexicano", p: 7.5, d: "Pan brioche, salchicha, tomate, pepinillo, guacamole y nachos troceados" }
        ]
      },
      {
        nombre: "Pizzas, todas a 10 €",
        platos: [
          { n: "Pizza margarita", p: 10 },
          { n: "Pizza de jamón york y queso", p: 10 },
          { n: "Pizza de beicon y queso", p: 10 },
          { n: "Pizza barbacoa", p: 10 },
          { n: "Pizza pepperoni", p: 10 },
          { n: "Pizza 5 quesos", p: 10 },
          { n: "Pan pizza", p: 4.5 }
        ]
      }
    ]
  },
  {
    id: "bocadillos",
    nombre: "Bocadillos y tostas",
    corto: "Bocadillos",
    mascota: "sandwich",
    foto: { src: "assets/img/sandwich.jpg", alt: "Sándwich de pollo con lechuga y tomate sobre pizarra" },
    nota: "Montados a 2 €, de lo que vale el bocadillo.",
    grupos: [
      {
        nombre: "Bocadillos",
        platos: [
          { n: "Beicon y queso", p: 5.5 },
          { n: "Chorizo", p: 5.5 },
          { n: "Jamón a la plancha con tomate y queso", p: 5.5 },
          { n: "Lomo, tomate y queso", p: 5.5 },
          { n: "Oreja", p: 6.5 },
          { n: "Serranito", p: 7 },
          { n: "El Rinconcito", p: 7, d: "Tortilla francesa, jamón a la plancha, rodajas de tomate y alioli" },
          { n: "Pulled pork ahumado", p: 7.5, d: "Carne mechada a baja temperatura, bbq, lechuga y pepinillo" },
          { n: "De la abuela", p: 7.5, d: "Lechuga, tomate, atún, pechuga, beicon y huevo frito" },
          { n: "De la casa", p: 7.5, d: "Lechuga, tomate, beicon, pechuga empanada y barbacoa" },
          { n: "Calamares", p: 9.5 },
          { n: "Montado", p: 2, d: "De lo que vale el bocadillo" }
        ]
      },
      {
        nombre: "Sándwiches",
        platos: [
          { n: "Sándwich mixto", p: 5, d: "Jamón york y queso" },
          { n: "Sándwich especial", p: 7.5, d: "Jamón york, mayonesa, lechuga, tomate, atún, pechuga y huevo duro" },
          { n: "Sándwich siciliano", p: 8.5, d: "Mortadela siciliana, guacamole, tomate cherry, rúcula, pesto y pan rústico" }
        ]
      },
      {
        nombre: "Tostas",
        platos: [
          { n: "Tosta caprese", p: 8, d: "Tomate cherry, mozzarella y orégano" },
          { n: "Tosta de pimiento", p: 8.5, d: "Mermelada de pimiento y queso de cabra" },
          { n: "Tosta de pollo", p: 8.5, d: "Pechuga de pollo, brotes verdes, queso tierno y cebolla caramelizada" },
          { n: "Tosta de tomate y boquerón", p: 8.5, d: "Boquerones, tomate, ajo picado y perejil" },
          { n: "Huevos revueltos con jamón y tomate", p: 9, d: "Jamón serrano, huevo, tomate, pimienta negra y brotes verdes" },
          { n: "Tosta de salmón", p: 9.5, d: "Salmón ahumado y crema de queso azul" },
          { n: "Tosta matrimonio", p: 9.5, d: "Boquerón, anchoa y tomate", nuevo: true }
        ]
      },
      {
        nombre: "Ensaladas",
        platos: [
          { n: "Tomate y mozzarella", p: 8.5 },
          { n: "Tomate y ventresca", p: 9.5 },
          { n: "Ensalada mixta", p: 9.5 },
          { n: "Ensalada César", p: 10 },
          { n: "Mermelada de pimiento, brotes, queso de cabra y gambones", p: 11 }
        ]
      }
    ]
  },
  {
    id: "dulces",
    nombre: "Postres y dulces",
    corto: "Postres",
    mascota: "tarta",
    nota: "Las tartas son caseras y cambian según el día. Pregunta cuáles quedan.",
    grupos: [
      {
        nombre: "Postres",
        platos: [
          { n: "Culán", p: 5.5, d: "De chocolate, chocolate blanco o pistacho" },
          { n: "Tartas caseras", p: 5.5, d: "Queso y chocolate blanco, de la abuela, lotus, pistacho, Pantera Rosa, Oreo, mango y fruta de la pasión, fresa o 3 chocolates" },
          { n: "Tiramisú", p: 5.5 },
          { n: "Bizcochada", p: 5.5 },
          { n: "Natillas", p: 5.5 },
          { n: "Arroz con leche", p: 5.5 },
          { n: "Helado", p: 5.5, d: "Vainilla, lotus o turrón" },
          { n: "Crepes, tortitas y gofres", p: 3.5, d: "Chocolate, chocolate blanco, Kinder, pistacho, lotus, caramelo o fresa" },
          { n: "Croissant premium", p: 3.5, d: "Chocolate, chocolate blanco, Kinder, pistacho, lotus, caramelo o fresa" },
          { n: "Miguelitos", p: 2 }
        ]
      }
    ]
  },
  {
    id: "barra",
    nombre: "Cafés y bebidas",
    corto: "Bebidas",
    mascota: "botella",
    grupos: [
      {
        nombre: "Cafés",
        platos: [
          { n: "Café solo", p: 1.3 },
          { n: "Americano", p: 1.3 },
          { n: "Cortado", p: 1.3 },
          { n: "Café con leche", p: 1.5 },
          { n: "Infusiones", p: 1.5 }
        ]
      },
      {
        nombre: "Bebidas",
        platos: [
          { n: "Refrescos", p: 2.5 },
          { n: "Zumos", p: 2.5 },
          { n: "Agua 0,5 l", p: 1.5 },
          { n: "Agua 1,5 l", p: 3 },
          { n: "Tinto de verano", p: 3 },
          { n: "Tinto casero", p: 4 },
          { n: "Tinto de verano de la casa", p: 5 },
          { n: "Estrella Galicia", texto: "1,50 / 2,50 €" },
          { n: "Mahou Verde, caña o copa", p: 2.5 },
          { n: "Mahou Verde", p: 2.7 },
          { n: "Mahou 5 Estrellas", p: 2.5 },
          { n: "Cerveza sin alcohol", p: 2.5 },
          { n: "Tostada 0,0", p: 2.5 },
          { n: "Alhambra", p: 3 },
          { n: "Corona", p: 3 },
          { n: "Radler", p: 2.5 }
        ]
      }
    ]
  }
];

// Menú del día de ejemplo (el último que publicaron). Se usa solo mientras
// no esté conectada la hoja de Google del bar (ver MENU_HOJA en app.js).
window.MENU_EJEMPLO = {
  fecha: null,
  primeros: ["Ensalada caprese", "Huevos rotos con jamón", "Croquetas caseras", "Ensaladilla rusa", "Lentejas con chorizo"],
  segundos: ["Brochetas de pollo", "San Jacobo con patatas fritas", "Chuleta de cerdo a la plancha", "Lomo en salsa de setas", "Pescadilla a la plancha"],
  precio: 13.5
};
