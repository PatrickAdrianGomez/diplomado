import { Router } from 'express';
import authController from '../controllers/auth.controller.js'; // Importar el controlador de autenticación

const router = Router();
router.post('/', authController.login); // Ruta para iniciar sesión
// Aquí puedes agregar más rutas relacionadas con la autenticación, como registro de usuarios, recuperación de contraseña, etc.

export default router;