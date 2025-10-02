const { DateTime } = require("luxon");

function nowChile() {
  return DateTime.now().setZone("America/Santiago");
}

function nowChileSQL() {
  return nowChile().toFormat("yyyy-MM-dd HH:mm:ss");
}

module.exports = { nowChile, nowChileSQL };