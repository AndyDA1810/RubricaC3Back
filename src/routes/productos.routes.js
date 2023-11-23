import { Router } from "express";
import{DeleteProducto, UpdateProductos, getProducto, getProductos, setProductos, verificaciontoken} from "../controllers/productos.controller.js"

const router = Router()

router
    .route("/productos")
    .get(verificaciontoken, getProductos)
    .post(verificaciontoken, setProductos)

router
    .route("/productos/:Codigo")
    .get(verificaciontoken, getProducto)
    .patch(verificaciontoken, UpdateProductos)
    .delete(verificaciontoken, DeleteProducto)

export default router