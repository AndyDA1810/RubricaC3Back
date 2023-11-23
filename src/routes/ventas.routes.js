import { Router } from "express";
import { AddVentas, DeleteVenta, UpdateVenta, getVenta, getVentafull, getVentas } from "../controllers/ventas.controller.js";
import { verificaciontoken } from "../controllers/productos.controller.js";

const router = Router()

router
    .route("/ventas")
    .get(verificaciontoken, getVentas)
    .post(verificaciontoken, AddVentas)

router
    .route("/ventas/:Codigo")
    .get(verificaciontoken, getVenta)
    .patch(verificaciontoken, UpdateVenta)
    .delete(verificaciontoken, DeleteVenta)

router
    .route("/FullVentas")
    .get(verificaciontoken, getVentafull)


export default router