import { pool } from "../db/db.js";
import jwt from "jsonwebtoken"

export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Productos");
    res.send(rows);
  } catch (error) {
    return res.status(500).json({ message: "ERROR" });
  }
};

export const getProducto = async (req, res) => {
  const Codigo = req.params.Codigo;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Productos WHERE Codigo = ?",
      [Codigo]
    );
    if (rows.length <= 0)
      return res.status(400).json({ message: "Producto No registrado" });
    res.send(rows);
  } catch (error) {
    return res.status(500).json({ message: "Ha ocurrido un error" });
  }
};

export const setProductos = async (req, res) => {
  const { Nombre, Descripcion, Precio, Stock } = req.body;
  const { Rol } = req.user
  console.log(Rol)
  try {
    if (Rol !== "Admin") {
      return res.status(401).json({ message: "NO AUTORIZADO" })
    } else {
      const [rows] = await pool.query(
        "INSERT INTO Productos (Nombre, Descripcion, Precio, Stock) VALUES(?,?,?,?)",
        [Nombre, Descripcion, Precio, Stock]
      );

      console.log(rows);

      res.send({
        Codigo: rows.insertId,
        Nombre,
        Descripcion,
        Precio,
        Stock,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "ERROR" });
  }
};

export const UpdateProductos = async (req, res) => {
  const Codigo = req.params.Codigo;
  const { Nombre, Descripcion, Precio, Stock } = req.body;
  const { Rol } = req.user
  console.log(Rol)
  try {
    if (Rol !== "Admin") {
      return res.status(401).json({ message: "NO AUTORIZADO" })
    } else {
      const [result] = await pool.query(
        "UPDATE Productos SET Nombre=IFNULL(?,Nombre), Descripcion=IFNULL(?,Descripcion), Precio=IFNULL(?,Precio), Stock=IFNULL(?,Stock) WHERE Codigo = ?",
        [Nombre, Descripcion, Precio, Stock, Codigo]
      );

      if (result.affectedRows <= 0)
        return res.status(404).json({
          message: "Producto no encontrado",
        });

      const [rows] = await pool.query("SELECT * FROM Productos WHERE Codigo=?", [
        Codigo,
      ]);
      res.json(rows[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: "ERROR" });
  }
};

export const DeleteProducto = async (req, res) => {
  const Codigo = req.params.Codigo;
  const { Rol } = req.user
  console.log(Rol)
  try {
    if (Rol !== "Admin") {
      return res.status(401).json({ message: "NO AUTORIZADO" })
    } else {
      const [result] = await pool.query("DELETE FROM Productos WHERE Codigo=?", [Codigo]);

      if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Producto no encontrado'
      })

      const [rows] = await pool.query("SELECT * FROM Productos")
      res.send(rows)

    }
  } catch (error) {
    return res.status(500).json({ message: "ERROR" });
  }
};

export const verificaciontoken = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: "No autorizado" })

  } else {
    jwt.verify(token, "secretkey", (error, datos) => {
      if (error) {
        return res.status(401).json({ message: "No autorizado" })
      } else {
        req.user = datos
        next()
      }
    })
  }
}
