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

exports.getAllDispositivos = async (req, res) => {
  try {
    const dispositivos = await Dispositivo.findAll({
      order: [['id', 'ASC']]
    });

    res.json({
      ok: true,
      data: dispositivos
    });
  } catch (error) {
    console.error("Error al obtener dispositivos:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
      detail: error.message
    });
  }
};

exports.updateDispositivoStatus = async (req, res) => {
  try {
    const { identificador } = req.params;
    const { status, convenios } = req.body;

    const dispositivo = await Dispositivo.findOne({
      where: { identificador }
    });

    if (!dispositivo) {
      return res.status(404).json({
        ok: false,
        message: "Dispositivo no encontrado"
      });
    }

    if (status !== undefined) dispositivo.status = status;
    if (convenios !== undefined) dispositivo.convenios = Boolean(convenios);
    await dispositivo.save();

    res.json({
      ok: true,
      message: "Dispositivo actualizado correctamente",
      data: dispositivo
    });
  } catch (error) {
    console.error("Error al actualizar dispositivo:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
      detail: error.message
    });
  }
};

exports.updateDispositivoConvenios = async (req, res) => {
  try {
    const { identificador } = req.params;
    const { convenios } = req.body;

    if (convenios === undefined) {
      return res.status(400).json({
        ok: false,
        message: "El campo 'convenios' (boolean) es requerido"
      });
    }

    const dispositivo = await Dispositivo.findOne({
      where: { identificador }
    });

    if (!dispositivo) {
      return res.status(404).json({
        ok: false,
        message: "Dispositivo no encontrado"
      });
    }

    dispositivo.convenios = Boolean(convenios);
    await dispositivo.save();

    res.json({
      ok: true,
      message: "Estado de convenios actualizado correctamente",
      data: dispositivo
    });
  } catch (error) {
    console.error("Error al actualizar convenios del dispositivo:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
      detail: error.message
    });
  }
};
