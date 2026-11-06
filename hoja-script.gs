// Programa para la hoja de Google de El Pollo Chelero.
// Deja que la página de pedidos (pedidos.html#editar) guarde la carta en esta hoja.
// Cambia 1234 por la clave que les darás a tus papás.
const CLAVE = '1234';

function doPost(e) {
  let d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { return responder({ ok: false, error: 'datos' }); }
  if (String(d.clave || '') !== CLAVE) return responder({ ok: false, error: 'clave' });
  if (d.accion === 'probar') return responder({ ok: true });
  if (d.accion !== 'guardar' || !Array.isArray(d.filas)) return responder({ ok: false, error: 'accion' });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
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
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return responder({ ok: true, nota: 'La hoja de El Pollo Chelero está lista.' });
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
