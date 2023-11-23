import{pool} from "../db/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const crearusuario = async (req, res) => {
    const data = req.body
    const password = data.pass;
    try {
       const password_cifrada = await bcrypt.hash(password,10)
       const [rows]= await pool.query("INSERT INTO Usuarios (Cedula_ciudadania, Nombre, Apellido, Correo, Rol, pass) VALUES(?,?,?,?,?,?)",[data.id, data.Nombre, data.Apellido, data.Correo, "Usuario", password_cifrada])
       
       const newusuario = {
        id: data.id,
        Nombre: data.Nombre,
        Apellido: data.Apellido,
        Correo: data.Correo,
        Rol: "Usuario",
       }
       jwt.sign(newusuario, "secretkey", (error,token) => {
        if (error){
            res.status(500).json({message:error})
        } else {
            res.cookie("token", token, {})
            res.status(200).json({newusuario, token})
        }
       })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export const ingresarusuario = async (req, res) => {
    const data = req.body
    try {
        const[rows]= await pool.query("SELECT * FROM Usuarios WHERE Cedula_ciudadania = ? ", [data.id])
        if (rows.length>0){
            const password_validacion =await bcrypt.compare(data.pass, rows[0].pass)
            if (!password_validacion) {
                res.status(204).json({message:"Error usuario no encontrado"})
            } else{
                const usuario = {
                    id: data.id,
                    Nombre: rows[0].Nombre,
                    Apellido: rows[0].Apellido,
                    Correo: rows[0].Correo,
                    Rol: rows[0].Rol,
                   }
                   jwt.sign(usuario, "secretkey", (error,token) => {
                    if (error){
                        res.status(500).json({message:error})
                    } else {
                        res.cookie("token", token, {})
                        res.status(200).json({usuario, token})
                    }
                   })
            }
        } else {
            res.status(204).json({message:"Error usuario no encontrado"})
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export const cerrarsesion = (req, res) => {
    res.cookie("token", "", {
        expires: new Date (0)
    }) 
    return res.status(200).end()
}