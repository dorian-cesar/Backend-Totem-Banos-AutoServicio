const { DateTime } = require("luxon");

// Devuelve la hora actual de Chile en objeto DateTime
function nowChile() {
  return DateTime.now().setZone("America/Santiago");
}

// Devuelve la hora actual de Chile en formato MySQL (YYYY-MM-DD HH:mm:ss)
function nowChileSQL() {
  return nowChile().toFormat("yyyy-LL-dd HH:mm:ss");
}

module.exports = { nowChile, nowChileSQL };