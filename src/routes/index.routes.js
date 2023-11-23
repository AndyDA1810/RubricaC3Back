import { Router } from "express";
import { cerrarsesion, crearusuario, ingresarusuario } from "../controllers/usuarios.controller.js";

const router = Router()

router.post('/login', ingresarusuario)
router.post('/create', crearusuario)
router.post('/final', cerrarsesion)
export default router