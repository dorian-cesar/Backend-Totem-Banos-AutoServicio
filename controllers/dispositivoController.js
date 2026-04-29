const Dispositivo = require("../models/Dispositivo");

exports.getDispositivoByIdentificador = async (req, res) => {
  try {
    const { identificador } = req.params;
    
    const dispositivo = await Dispositivo.findOne({
      where: { identificador }
    });

    if (!dispositivo) {
      return res.status(404).json({
        ok: false,
        message: "Dispositivo no encontrado"
      });
    }

    res.json({
      ok: true,
      data: dispositivo
    });
  } catch (error) {
    console.error("Error al obtener dispositivo:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
      detail: error.message
    });
  }
};
