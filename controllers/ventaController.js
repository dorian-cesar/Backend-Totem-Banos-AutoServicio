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
      // nuevos:
      ip_amos,
      ubicacion,
      // opcionales:
      id_transaccion,
      codigo_autorizacion,
      codigo_comercio,
    } = req.body;

    // Validación básica
    if (!usuario_id || !servicio_id || !monto || !metodo_pago || !ip_amos || !ubicacion) {
      return res.status(400).json({ error: "Faltan datos obligatorios: usuario_id, servicio_id, monto, metodo_pago, ip, ubicacion" });
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
    });

    return res.status(201).json(venta);
  } catch (err) {
    console.error("Error creando venta:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
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
          // Permite buscar también dentro de usuario
          ...(search && {
            where: {
              [require("sequelize").Op.or]: [
                { name: { [require("sequelize").Op.like]: `%${search}%` } },
                { email: { [require("sequelize").Op.like]: `%${search}%` } },
              ],
            },
          }),
          required: false, // para no excluir ventas sin usuario
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