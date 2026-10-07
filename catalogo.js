// Micro frontend: CATÁLOGO  (equipo "Descubrimiento")
// Contrato: window.renderCatalogo(idContenedor) / window.unmountCatalogo(idContenedor)
// Publica: evento 'carrito:agregar' con { id, nombre, precio }
(function () {
  const VERSION = '1.0.0';

  const PLATOS = [
    { id: 1, nombre: 'Chivo guisado',        precio: 28000, categoria: 'Plato fuerte' },
    { id: 2, nombre: 'Arroz de payaso',      precio: 22000, categoria: 'Plato fuerte' },
    { id: 3, nombre: 'Sancocho de gallina',  precio: 25000, categoria: 'Plato fuerte' },
    { id: 4, nombre: 'Arepa de huevo',       precio: 6000,  categoria: 'Entrada' },
    { id: 5, nombre: 'Carimañola',           precio: 4500,  categoria: 'Entrada' },
    { id: 6, nombre: 'Jugo de corozo',       precio: 5000,  categoria: 'Bebida' },
    { id: 7, nombre: 'Limonada de panela',   precio: 4000,  categoria: 'Bebida' },
    { id: 8, nombre: 'Dulce de leche cortada', precio: 7000, categoria: 'Postre' }
  ];

  const pesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

  // Estilos propios con prefijo "cat-" para no chocar con otros equipos
  const CSS = `
    .cat-titulo { margin: 0 0 10px; color: var(--upc-color-primario, #12432b); font-family: var(--upc-fuente-display, 'Fraunces', Georgia, serif); font-size: clamp(32px, 5vw, 48px); font-weight: 700; letter-spacing: -.02em; line-height: 1.05; }
    .cat-version { display: inline-flex; align-items: center; gap: 7px; font-family: var(--upc-fuente-mono, 'IBM Plex Mono', Consolas, monospace); font-size: 12px; line-height: 1; color: var(--upc-color-texto-tenue, #5f6a58); background: var(--upc-color-primario-suave, #e3efe4); padding: 6px 11px; border-radius: 999px; }
    .cat-version::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--upc-color-exito, #2f8f4e); }
    .cat-buscar { display: block; width: 100%; margin: 22px 0 26px; padding: 14px 20px 14px 50px; border: 1.5px solid var(--upc-color-borde-input, #cdbf9c); border-radius: 999px; font-family: var(--upc-fuente-base, 'Hanken Grotesk', system-ui, sans-serif); font-size: var(--upc-texto-md, 16px); color: var(--upc-color-texto, #1c2b21); background: var(--upc-color-superficie, #fffcf3) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a5848' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='m20 20-3.5-3.5'/%3E%3C/svg%3E") no-repeat 19px center / 20px; transition: border-color .2s, box-shadow .2s; }
    .cat-buscar::placeholder { color: var(--upc-color-texto-tenue, #5f6a58); }
    .cat-buscar:focus { outline: none; border-color: var(--upc-color-exito, #2f8f4e); box-shadow: 0 0 0 4px rgba(47, 143, 78, .2); }
    .cat-grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 20px; }
    .cat-tarjeta { position: relative; display: flex; flex-direction: column; overflow: hidden; padding: 22px 20px 20px; background: var(--upc-color-superficie, #fffcf3); border: 1px solid var(--upc-color-borde, #e3d9bd); border-radius: var(--upc-radio-2, 14px); box-shadow: var(--upc-sombra-1, 0 1px 2px rgba(18, 67, 43, .08), 0 8px 18px -10px rgba(18, 67, 43, .22)); transition: transform .28s cubic-bezier(.2, .8, .2, 1), box-shadow .28s, border-color .28s; }
    .cat-tarjeta::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: repeating-linear-gradient(90deg, var(--upc-color-acento, #f2b632) 0 14px, var(--upc-color-exito, #2f8f4e) 14px 28px); opacity: 0; transition: opacity .28s; }
    .cat-tarjeta:hover { transform: translateY(-5px); box-shadow: var(--upc-sombra-2, 0 2px 4px rgba(18, 67, 43, .10), 0 20px 34px -16px rgba(18, 67, 43, .38)); border-color: var(--upc-color-exito, #2f8f4e); }
    .cat-tarjeta:hover::before { opacity: 1; }
    .cat-categoria { align-self: flex-start; padding: 5px 10px; border-radius: 999px; background: var(--upc-color-exito-fondo, #e4f1e1); color: var(--upc-color-exito-oscuro, #1b6b3a); font-size: 11px; font-weight: 700; letter-spacing: .12em; line-height: 1; text-transform: uppercase; }
    .cat-nombre { margin: 16px 0 6px; font-family: var(--upc-fuente-display, 'Fraunces', Georgia, serif); font-size: 22px; font-weight: 600; line-height: 1.15; }
    .cat-precio { margin: auto 0 16px; padding-top: 10px; font-family: var(--upc-fuente-mono, 'IBM Plex Mono', Consolas, monospace); font-size: 18px; font-weight: 500; color: var(--upc-color-primario, #12432b); }
    .cat-boton { width: 100%; padding: 11px 16px; border: 0; border-radius: 999px; background: var(--upc-color-exito-oscuro, #1b6b3a); color: var(--upc-color-sobre-primario, #fbf5e6); font-family: var(--upc-fuente-base, 'Hanken Grotesk', system-ui, sans-serif); font-size: var(--upc-texto-sm, 14px); font-weight: 600; cursor: pointer; transition: background .2s, transform .15s; }
    .cat-boton:hover { background: var(--upc-color-primario, #12432b); }
    .cat-boton:active { transform: scale(.97); }
    .cat-boton:focus-visible { outline: 3px solid var(--upc-color-acento, #f2b632); outline-offset: 2px; }
    .cat-vacio { grid-column: 1 / -1; padding: 44px 16px; border: 2px dashed var(--upc-color-borde-input, #cdbf9c); border-radius: var(--upc-radio-2, 14px); color: var(--upc-color-texto-suave, #4a5848); font-style: italic; text-align: center; }
  `;

  function asegurarEstilos() {
    if (document.getElementById('cat-estilos')) return;
    const style = document.createElement('style');
    style.id = 'cat-estilos';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  let filtro = '';            // estado interno: solo le importa a este micro frontend
  let manejadores = null;     // para poder retirar los listeners al desmontar

  function tarjetas() {
    const lista = PLATOS.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()));
    if (lista.length === 0) return '<p class="cat-vacio">No hay platos que coincidan.</p>';
    return lista.map(p => `
      <article class="cat-tarjeta">
        <div class="cat-categoria">${p.categoria}</div>
        <div class="cat-nombre">${p.nombre}</div>
        <div class="cat-precio">${pesos.format(p.precio)}</div>
        <button class="cat-boton" data-id="${p.id}">Agregar al carrito</button>
      </article>`).join('');
  }

  window.renderCatalogo = function (idContenedor) {
    asegurarEstilos();
    const raiz = document.getElementById(idContenedor);
    raiz.innerHTML = `
      <h2 class="cat-titulo">Catálogo de platos</h2>
      <span class="cat-version">mfe-catalogo v${VERSION}</span>
      <input class="cat-buscar" placeholder="Buscar un plato..." value="${filtro}">
      <div class="cat-grilla">${tarjetas()}</div>`;

    const grilla = raiz.querySelector('.cat-grilla');
    const buscar = raiz.querySelector('.cat-buscar');

    manejadores = {
      raiz: raiz,
      click: function (e) {
        const boton = e.target.closest('.cat-boton');
        if (!boton) return;
        const plato = PLATOS.find(p => p.id === Number(boton.dataset.id));
        // Comunicación indirecta: publicamos un evento y NO sabemos quién lo escucha
        window.dispatchEvent(new CustomEvent('carrito:agregar', {
          detail: { id: plato.id, nombre: plato.nombre, precio: plato.precio }
        }));
        boton.textContent = '¡Agregado!';
        setTimeout(function () { boton.textContent = 'Agregar al carrito'; }, 800);
      },
      input: function (e) {
        filtro = e.target.value;
        grilla.innerHTML = tarjetas();
      }
    };
    raiz.addEventListener('click', manejadores.click);
    buscar.addEventListener('input', manejadores.input);
  };

  window.unmountCatalogo = function (idContenedor) {
    const raiz = document.getElementById(idContenedor);
    if (manejadores) {
      manejadores.raiz.removeEventListener('click', manejadores.click);
      manejadores = null;
    }
    raiz.innerHTML = '';
  };
})();
