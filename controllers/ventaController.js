// controllers/ventaController.js
const Venta = require("../models/Venta");
const User = require("../models/User");
const Servicio = require("../models/Servicio");

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
      estado,
      id_transaccion,
      codigo_autorizacion,
      codigo_comercio,
    } = req.body;

    // Validaciones básicas
    if (!usuario_id || !servicio_id || !monto || !metodo_pago) {
      return res.status(400).json({
        ok: false,
        message: "Faltan datos obligatorios",
        missing: {
          usuario_id: !!usuario_id,
          servicio_id: !!servicio_id,
          monto: !!monto,
          metodo_pago: !!metodo_pago,
        },
      });
    }

    const nuevaVenta = await Venta.create({
      usuario_id,
      servicio_id,
      monto,
      metodo_pago,
      estado: estado || "pendiente",
      id_transaccion,
      codigo_autorizacion,
      codigo_comercio,
    });

    return res.status(201).json({
      ok: true,
      message: "Venta registrada exitosamente",
      data: nuevaVenta,
    });
  } catch (error) {
    console.error("[VENTA CONTROLLER] Error al crear venta:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al registrar venta",
      code: "CREATE_VENTA_ERROR",
      detail: error?.message,
    });
  }
};

// ===============================
// Obtener todas las ventas
// ===============================
exports.getVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: User, as: "usuario", attributes: ["id", "name", "last_name", "email"] },
        { model: Servicio, as: "servicio", attributes: ["id", "nombre", "precio"] },
      ],
      order: [["creado_en", "DESC"]], // <-- coincide con tu columna en DB
    });

    return res.status(200).json({
      ok: true,
      message: "Ventas obtenidas correctamente",
      data: ventas,
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

    return res.status(200).json({
      ok: true,
      message: "Venta obtenida correctamente",
      data: venta,
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
