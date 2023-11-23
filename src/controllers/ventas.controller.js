import { pool } from "../db/db.js";

export const getVentas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Ventas");
    res.send(rows);
  } catch (error) {
    return res.status(500).json({ message: "ERROR" });
  }
};

export const getVenta = async (req, res) => {
  const Codigo = req.params.Codigo;
  try {
    const [rows] = await pool.query("SELECT * FROM Ventas WHERE Codigo = ?", [
      Codigo,
    ]);
    if (rows.length <= 0)
      return res.status(400).json({ message: "Venta No registrado" });
    res.send(rows);
  } catch (error) {
    return res.status(500).json({ message: "ERROR" });
  }
};

export const AddVentas = async (req, res) => {
  const {
    Codigo_producto,
    Nombre_cliente,
    Telefono_cliente,
    Fecha_venta,
    Cantidad_vendida,
  } = req.body;

  try {

    let Total_venta = await PrecioUnitario(Codigo_producto,Cantidad_vendida)

    const [rows] = await pool.query(
      "INSERT INTO Ventas (Codigo_producto,Nombre_cliente,Telefono_cliente,Fecha_venta,Cantidad_vendida,Total_venta) VALUES (?,?,?,?,?,?)",
      [
        Codigo_producto,
        Nombre_cliente,
        Telefono_cliente,
        Fecha_venta,
        Cantidad_vendida,
        Total_venta,
      ]
    );

    console.log(rows);

    res.send({
      Codigo: rows.insertId,
      Codigo_producto,
      Nombre_cliente,
      Telefono_cliente,
      Fecha_venta,
      Cantidad_vendida,
      Total_venta,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR" });
  }
};



export const UpdateVenta = async (req, res) => {
  const Codigo = req.params.Codigo;

  const {
    Codigo_producto,
    Nombre_cliente,
    Telefono_cliente,
    Fecha_venta,
    Cantidad_vendida,
  } = req.body;
  
  let Total_venta

  try {
    if (Codigo_producto && Cantidad_vendida) {
      Total_venta = await PrecioUnitario(Codigo_producto, Cantidad_vendida);
    } else if (Codigo_producto) {
      const [cantidad] = await pool.query(
        "SELECT Cantidad_vendida FROM Ventas WHERE Codigo = ?",
        [Codigo]
      );
      let cantidadv = cantidad[0].Cantidad_vendida;
      Total_venta = await PrecioUnitario(Codigo_producto, cantidadv);
    } else if (Cantidad_vendida) {
      const [Codigopres] = await pool.query(
        "SELECT Codigo_producto FROM Ventas WHERE Codigo = ?",
        [Codigo]
      );
      let Codigop = Codigopres[0].Codigo_producto;
      Total_venta = await PrecioUnitario(Codigop, Cantidad_vendida);
    }

    const [result] = await pool.query(
      "UPDATE Ventas SET  Codigo_producto=IFNULL(?,Codigo_producto), Nombre_cliente=IFNULL(?,Nombre_cliente), Telefono_cliente=IFNULL(?,Telefono_cliente), Fecha_venta=IFNULL(?,Fecha_venta), Cantidad_vendida=IFNULL(?,Cantidad_vendida), Total_venta=IFNULL(?,Total_venta) WHERE Codigo = ?",
      [
        Codigo_producto,
        Nombre_cliente,
        Telefono_cliente,
        Fecha_venta,
        Cantidad_vendida,
        Total_venta,
        Codigo
      ]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Producto no encontrado",
      });

    const [rows] = await pool.query("SELECT * FROM Ventas WHERE Codigo = ?", [
      Codigo,
    ]);
    
    if (rows.length <= 0)
      return res.status(400).json({ message: "Venta No registrado" });
    res.send(rows);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR" });
  }
};

export const DeleteVenta = async (req, res) => {
  const Codigo = req.params.Codigo;

  try {
    const [result] = await pool.query("DELETE FROM Ventas WHERE Codigo=?", [
      Codigo,
    ]);
    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Venta no encontrado",
      });

    const [rows] = await pool.query("SELECT * FROM Ventas");
    res.send(rows);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const PrecioUnitario = async (Codigo_producto, Cantidad_vendida) => {
  try {
    const [precioUnitario] = await pool.query(
      "SELECT Precio FROM Productos WHERE Codigo = ?",
      [Codigo_producto]
    );

    let Total_venta =
      parseInt(precioUnitario[0].Precio) * parseInt(Cantidad_vendida);
    return Total_venta;
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getVentafull = async (req,res) =>{
  try {
    const [rows] = await pool.query("SELECT * FROM Productos INNER JOIN Ventas ON Productos.Codigo = Ventas.Codigo_producto")
    res.send(rows);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
