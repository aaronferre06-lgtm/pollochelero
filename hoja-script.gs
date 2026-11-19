// Programa para la hoja de Google de El Pollo Chelero.
// - Guarda la carta que se edita en pedidos.html#editar (primera pestaña).
// - Guarda y lee las ventas de la caja (caja.html) en la pestaña "Ventas".
// Pon aquí la misma clave que ya usan tus papás.
const CLAVE = '1234';

const COLS = ['ID', 'Fecha', 'Hora', 'N°', 'Lugar', 'Detalle', 'Total', 'Medio', 'Comisión', 'Cobrado', 'Paga con', 'Vuelto', 'Estado', 'Items'];

function doPost(e) {
  let d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { return responder({ ok: false, error: 'datos' }); }
  if (String(d.clave || '') !== CLAVE) return responder({ ok: false, error: 'clave' });
  if (d.accion === 'probar') return responder({ ok: true });
  if (d.accion === 'guardar') return guardarCarta(d);
  if (d.accion === 'venta') return guardarVenta(d.venta || {});
  if (d.accion === 'ventas') return leerVentas(String(d.fecha || ''));
  if (d.accion === 'anular') return anularVenta(String(d.id || ''));
  return responder({ ok: false, error: 'accion' });
}

function guardarCarta(d) {
  if (!Array.isArray(d.filas)) return responder({ ok: false, error: 'accion' });
  return conCandado(() => {
    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const filas = d.filas.slice(0, 500).map(f => [
      String(f.seccion || '').slice(0, 60),
      String(f.plato || '').slice(0, 120),
      f.precio === '' || f.precio === null || isNaN(Number(f.precio)) ? '' : Number(f.precio),
      String(f.foto || '').slice(0, 500)
    ]).filter(f => f[0] && f[1]);
    const ultima = hoja.getLastRow();
    if (ultima > 1) hoja.getRange(2, 1, ultima - 1, 4).clearContent();
    if (filas.length) hoja.getRange(2, 1, filas.length, 4).setValues(filas);
    return responder({ ok: true, filas: filas.length });
  });
}

function hojaVentas() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let h = libro.getSheetByName('Ventas');
  if (!h) {
    h = libro.insertSheet('Ventas', libro.getSheets().length);
    h.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold');
    h.setFrozenRows(1);
    h.getRange('A:F').setNumberFormat('@');
  }
  return h;
}

function guardarVenta(v) {
  const id = String(v.id || '').slice(0, 40);
  if (!id || !v.fecha) return responder({ ok: false, error: 'datos' });
  return conCandado(() => {
    const h = hojaVentas();
    const ultima = h.getLastRow();
    if (ultima > 1) {
      const desde = Math.max(2, ultima - 800);
      const ids = h.getRange(desde, 1, ultima - desde + 1, 1).getDisplayValues().map(r => r[0]);
      if (ids.indexOf(id) >= 0) return responder({ ok: true, repetida: true });
    }
    const n = x => (x === '' || x === null || x === undefined || isNaN(Number(x))) ? '' : Number(x);
    h.appendRow([
      id, String(v.fecha).slice(0, 10), String(v.hora || '').slice(0, 8), String(v.num || ''),
      String(v.lugar || '').slice(0, 40), String(v.detalle || '').slice(0, 1000),
      n(v.total), String(v.medio || '').slice(0, 20), n(v.comision), n(v.cobrado),
      n(v.pagaCon), n(v.vuelto), 'OK', JSON.stringify(v.items || []).slice(0, 4000)
    ]);
    return responder({ ok: true });
  });
}

function leerVentas(fecha) {
  const h = hojaVentas();
  const ultima = h.getLastRow();
  if (ultima < 2) return responder({ ok: true, ventas: [] });
  const filas = h.getRange(2, 1, ultima - 1, COLS.length).getDisplayValues();
  const ventas = filas.filter(r => !fecha || r[1] === fecha).map(r => {
    const o = {};
    COLS.forEach((c, i) => { o[c] = r[i]; });
    return o;
  });
  return responder({ ok: true, ventas });
}

function anularVenta(id) {
  if (!id) return responder({ ok: false, error: 'datos' });
  return conCandado(() => {
    const h = hojaVentas();
    const ultima = h.getLastRow();
    if (ultima < 2) return responder({ ok: false, error: 'no-existe' });
    const ids = h.getRange(2, 1, ultima - 1, 1).getDisplayValues().map(r => r[0]);
    const i = ids.lastIndexOf(id);
    if (i < 0) return responder({ ok: false, error: 'no-existe' });
    h.getRange(i + 2, COLS.indexOf('Estado') + 1).setValue('ANULADA');
    return responder({ ok: true });
  });
}

function conCandado(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function doGet() {
  return responder({ ok: true, nota: 'La hoja de El Pollo Chelero está lista.' });
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
