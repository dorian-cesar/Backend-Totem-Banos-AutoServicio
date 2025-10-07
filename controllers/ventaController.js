const Venta = require("../models/Venta");
const User = require("../models/User");
const Servicio = require("../models/Servicio");
const moment = require("moment-timezone");

// ===============================
// Crear una nueva venta
// ===============================
exports.createVenta = async (req, res) => {
  try {
    const {
      usuario_id,
      servicio_id,
      monto,
      metodo_pago,
      ip_amos,
      ubicacion,
      id_transaccion,
      codigo_autorizacion,
      codigo_comercio,
      estado
    } = req.body;

    if (!usuario_id || !servicio_id || !monto || !metodo_pago || !ip_amos || !ubicacion) {
      return res.status(400).json({ 
        ok: false,
        error: "Faltan datos obligatorios" 
      });
    }

    const venta = await Venta.create({
      usuario_id,
      servicio_id,
      monto,
      metodo_pago,
      ip_amos,
      ubicacion,
      id_transaccion,
      codigo_autorizacion,
      codigo_comercio,
      estado
    });

    // 🔹 Convertir fecha a hora chilena antes de responder
    const ventaData = venta.toJSON();
    ventaData.creado_en_chile = moment(ventaData.creado_en)
      .tz("America/Santiago")
      .format("YYYY-MM-DD HH:mm:ss");

    return res.status(201).json({
      ok: true,
      message: "Venta creada correctamente",
      data: ventaData
    });
  } catch (err) {
    console.error("Error creando venta:", err);
    return res.status(500).json({ 
      ok: false,
      error: "Error interno del servidor"
    });
  }
};

// ===============================
// Obtener todas las ventas
// ===============================
exports.getVentas = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      const { Op } = require("sequelize");
      const term = `%${search}%`;
      where[Op.or] = [
        { estado: { [Op.like]: term } },
        { id_transaccion: { [Op.like]: term } },
        { codigo_comercio: { [Op.like]: term } },
        { ubicacion: { [Op.like]: term } },
        { ip_amos: { [Op.like]: term } },
      ];
    }

    const ventas = await Venta.findAll({
      where,
      include: [
        {
          model: User,
          as: "usuario",
          attributes: ["id", "name", "last_name", "email"],
          ...(search && {
            where: {
              [require("sequelize").Op.or]: [
                { name: { [require("sequelize").Op.like]: `%${search}%` } },
                { email: { [require("sequelize").Op.like]: `%${search}%` } },
              ],
            },
          }),
          required: false,
        },
        {
          model: Servicio,
          as: "servicio",
          attributes: ["id", "nombre", "precio"],
          ...(search && {
            where: {
              nombre: { [require("sequelize").Op.like]: `%${search}%` },
            },
          }),
          required: false,
        },
      ],
      order: [["creado_en", "DESC"]],
    });

    // 🔹 Formatear fechas a hora chilena
    const ventasFormateadas = ventas.map((v) => {
      const ventaData = v.toJSON();
      ventaData.creado_en_chile = moment(ventaData.creado_en)
        .tz("America/Santiago")
        .format("YYYY-MM-DD HH:mm:ss");
      return ventaData;
    });

    return res.status(200).json({
      ok: true,
      message: "Ventas obtenidas correctamente",
      data: ventasFormateadas,
    });
  } catch (error) {
    console.error("[VENTA CONTROLLER] Error al obtener ventas:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener ventas",
      code: "GET_VENTAS_ERROR",
      detail: error?.message,
    });
  }
};

// ===============================
// Obtener venta por ID
// ===============================
exports.getVentaById = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await Venta.findByPk(id, {
      include: [
        { model: User, as: "usuario", attributes: ["id", "name", "last_name", "email"] },
        { model: Servicio, as: "servicio", attributes: ["id", "nombre", "precio"] },
      ],
    });

    if (!venta) {
      return res.status(404).json({
        ok: false,
        message: "Venta no encontrada",
        code: "VENTA_NOT_FOUND",
      });
    }

    const ventaData = venta.toJSON();
    ventaData.creado_en_chile = moment(ventaData.creado_en)
      .tz("America/Santiago")
      .format("YYYY-MM-DD HH:mm:ss");

    return res.status(200).json({
      ok: true,
      message: "Venta obtenida correctamente",
      data: ventaData,
    });
  } catch (error) {
    console.error("[VENTA CONTROLLER] Error al obtener venta:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener venta",
      code: "GET_VENTA_ERROR",
      detail: error?.message,
    });
  }
};