/* Fotos de los platos: primero las fotos elegidas a mano, si no, se buscan solas en Wikimedia Commons (fotos libres). */
(function(){
  'use strict';
  const FIJAS = {"entero": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Roast_chicken.jpg/500px-Roast_chicken.jpg", "l": "Pollo entero", "p": "https://commons.wikimedia.org/wiki/File:Roast_chicken.jpg"}, "medio": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Roasted_chicken_and_potatoes.JPG/500px-Roasted_chicken_and_potatoes.JPG", "l": "Pollo en presas", "p": "https://commons.wikimedia.org/wiki/File:Roasted_chicken_and_potatoes.JPG"}, "cuarto": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Un_cuarto_de_Pollo_a_la_Brasa.JPG/500px-Un_cuarto_de_Pollo_a_la_Brasa.JPG", "l": "1/4 de pollo", "p": "https://commons.wikimedia.org/wiki/File:Un_cuarto_de_Pollo_a_la_Brasa.JPG"}, "cuarto2": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Un_cuarto_de_Pollo_a_la_Brasa_%28pecho%29.JPG/500px-Un_cuarto_de_Pollo_a_la_Brasa_%28pecho%29.JPG", "l": "1/4 pecho", "p": "https://commons.wikimedia.org/wiki/File:Un_cuarto_de_Pollo_a_la_Brasa_%28pecho%29.JPG"}, "octavo": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pollo_a_la_brasa_pierna_con_papas.JPG/500px-Pollo_a_la_brasa_pierna_con_papas.JPG", "l": "1/8 pierna", "p": "https://commons.wikimedia.org/wiki/File:Pollo_a_la_brasa_pierna_con_papas.JPG"}, "entero2": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Rotissierie_chicken.JPG/500px-Rotissierie_chicken.JPG", "l": "Pollo a la brasa", "p": "https://commons.wikimedia.org/wiki/File:Rotissierie_chicken.JPG"}, "cremas": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Cremas_del_Pollo_a_la_Brasa_%28Peru%29.JPG/500px-Cremas_del_Pollo_a_la_Brasa_%28Peru%29.JPG", "l": "Cremas", "p": "https://commons.wikimedia.org/wiki/File:Cremas_del_Pollo_a_la_Brasa_%28Peru%29.JPG"}, "papas": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Papas_Fritas.jpg/500px-Papas_Fritas.jpg", "l": "Papas fritas", "p": "https://commons.wikimedia.org/wiki/File:Papas_Fritas.jpg"}, "ensalada": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Ensalada.jpg/500px-Ensalada.jpg", "l": "Ensalada", "p": "https://commons.wikimedia.org/wiki/File:Ensalada.jpg"}, "chaufa": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Arroz_chaufa_simple.JPG/500px-Arroz_chaufa_simple.JPG", "l": "Arroz chaufa", "p": "https://commons.wikimedia.org/wiki/File:Arroz_chaufa_simple.JPG"}, "cola": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Glass_of_Cola.jpg/500px-Glass_of_Cola.jpg", "l": "Gaseosa", "p": "https://commons.wikimedia.org/wiki/File:Glass_of_Cola.jpg"}, "chicha": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Chicha_Morada_2017.jpg/500px-Chicha_Morada_2017.jpg", "l": "Chicha morada", "p": "https://commons.wikimedia.org/wiki/File:Chicha_Morada_2017.jpg"}, "cerveza": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Glass_of_beer_with_bottles_in_the_background.jpg/500px-Glass_of_beer_with_bottles_in_the_background.jpg", "l": "Cerveza", "p": "https://commons.wikimedia.org/wiki/File:Glass_of_beer_with_bottles_in_the_background.jpg"}, "huancaina": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Papa_a_la_huancaina.jpg/500px-Papa_a_la_huancaina.jpg", "l": "Papa a la huancaína", "p": "https://commons.wikimedia.org/wiki/File:Papa_a_la_huancaina.jpg"}, "ceviche": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Ceviche_de_pescado_%28La_Punta%2C_Callao%29.jpg/500px-Ceviche_de_pescado_%28La_Punta%2C_Callao%29.jpg", "l": "Ceviche", "p": "https://commons.wikimedia.org/wiki/File:Ceviche_de_pescado_%28La_Punta%2C_Callao%29.jpg"}, "caldo": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Caldo_de_gallina.png/500px-Caldo_de_gallina.png", "l": "Sopa o caldo", "p": "https://commons.wikimedia.org/wiki/File:Caldo_de_gallina.png"}, "arrozpollo": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Arroz_con_pollo_y_papa_a_la_huancaina.JPG/500px-Arroz_con_pollo_y_papa_a_la_huancaina.JPG", "l": "Arroz con pollo", "p": "https://commons.wikimedia.org/wiki/File:Arroz_con_pollo_y_papa_a_la_huancaina.JPG"}, "aji": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Aj%C3%AD_de_gallina_-_Tradicional.jpg/500px-Aj%C3%AD_de_gallina_-_Tradicional.jpg", "l": "Ají de gallina", "p": "https://commons.wikimedia.org/wiki/File:Aj%C3%AD_de_gallina_-_Tradicional.jpg"}, "seco": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Seco_de_cabrito_con_frijoles.JPG/500px-Seco_de_cabrito_con_frijoles.JPG", "l": "Seco con frejoles", "p": "https://commons.wikimedia.org/wiki/File:Seco_de_cabrito_con_frijoles.JPG"}, "tallarin": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tallarin_Saltado_Peru.jpg/500px-Tallarin_Saltado_Peru.jpg", "l": "Tallarín saltado", "p": "https://commons.wikimedia.org/wiki/File:Tallarin_Saltado_Peru.jpg"}, "lomo": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Lomo_saltado_peruano.jpg/500px-Lomo_saltado_peruano.jpg", "l": "Lomo saltado", "p": "https://commons.wikimedia.org/wiki/File:Lomo_saltado_peruano.jpg"}, "chicharron": {"u": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Chicharr%C3%B3n_de_paiche.jpg/500px-Chicharr%C3%B3n_de_paiche.jpg", "l": "Chicharrón de pescado", "p": "https://commons.wikimedia.org/wiki/File:Chicharr%C3%B3n_de_paiche.jpg"}};
  function norm(t){ return (t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
  const RULES = [[/mostrit|chaufa/,'chaufa'],[/1\/8|octavo/,'octavo'],[/1\/4|cuarto/,'cuarto'],[/1\/2|medio pollo/,'medio'],[/entero|^1 pollo|un pollo/,'entero'],
    [/huancain/,'huancaina'],[/chicharron/,'chicharron'],[/ceviche|cebiche/,'ceviche'],[/sopa|caldo|dieta|chupe|aguadito|menestron/,'caldo'],
    [/arroz con pollo/,'arrozpollo'],[/aji de gallina|\baji\b/,'aji'],[/\bseco\b/,'seco'],[/tallarin|fideo/,'tallarin'],[/lomo|saltado/,'lomo'],
    [/papa/,'papas'],[/ensalad/,'ensalada'],[/crema/,'cremas'],[/chicha/,'chicha'],[/cerveza|chela|pilsen|cristal|cusquena/,'cerveza'],
    [/gaseosa|coca|inca kola|\bcola\b|sprite|fanta|agua mineral/,'cola'],[/pescado/,'chicharron'],[/pollo|brasa/,'cuarto']];
  function fija(name){ const n = norm(name); for(const r of RULES){ if(r[0].test(n)) return r[1]; } return null; }

  /* lo que se busca en internet: el nombre del plato sin cantidades ni medidas */
  function limpiar(name){
    let n = (name || '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[0-9]+([.,][0-9]+)?\s*(l|lt|lts|litros?|ml|oz|kg|g)\b/g, ' ')
      .replace(/\b(porcion|porciones|jarra|vaso|personal|grande|chica|mediana|familiar|de la casa|del dia|especial)\b/g, ' ')
      .replace(/[^a-záéíóúüñ\s]/g, ' ').replace(/\s+/g, ' ').trim();
    n = n.replace(/^(de|del|la|el|los|las)\s+/, '');
    return n.split(' ').slice(0, 5).join(' ');
  }
  const KEY = 'pollo-fotos-web-v1';
  let CACHE = {};
  try{ CACHE = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }catch(e){ CACHE = {}; }
  function guardar(){ try{ localStorage.setItem(KEY, JSON.stringify(CACHE)); }catch(e){} }
  const API = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&prop=imageinfo&iiprop=url|mime&iiurlwidth=500';
  async function consulta(q, n){
    const r = await fetch(API + '&gsrlimit=' + n + '&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap'));
    if(!r.ok) throw new Error('http ' + r.status);
    const j = await r.json();
    const pages = Object.values((j.query && j.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    return pages.map(p => { const i = p.imageinfo && p.imageinfo[0]; if(!i || !i.thumburl || !/jpeg|png|webp/.test(i.mime || '')) return null;
      return {u:i.thumburl, p:i.descriptionurl || ('https://commons.wikimedia.org/wiki/' + encodeURIComponent(p.title)), l:(p.title || '').replace(/^File:|^Archivo:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' ')}; }).filter(Boolean);
  }
  async function lista(name, n){
    const q = limpiar(name); if(!q) return [];
    let res = await consulta(q, n || 9);
    if(!res.length && q.split(' ').length > 2) res = await consulta(q.split(' ').slice(0, 2).join(' '), n || 9);
    return res;
  }
  const pend = {};
  function buscar(name){
    const q = limpiar(name); if(!q) return Promise.resolve(null);
    if(Object.prototype.hasOwnProperty.call(CACHE, q)) return Promise.resolve(CACHE[q]);
    if(pend[q]) return pend[q];
    pend[q] = lista(name, 5).then(r => { CACHE[q] = r[0] || null; guardar(); delete pend[q]; return CACHE[q]; })
      .catch(() => { delete pend[q]; return null; });
    return pend[q];
  }
  function guardada(name){ const q = limpiar(name); return Object.prototype.hasOwnProperty.call(CACHE, q) ? CACHE[q] : undefined; }
  function elegir(name, foto){ const q = limpiar(name); if(!q) return; CACHE[q] = foto; guardar(); }
  window.FotosPlatos = {FIJAS, fija, limpiar, buscar, lista, guardada, elegir};
})();
