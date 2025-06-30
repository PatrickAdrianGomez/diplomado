// Así era antes, pero ahora se usa en el archivo de configuración de rutas
//import express from 'express';

import { Router } from 'express';
import usersController from '../controllers/user.controller.js';
import validate from '../validators/validate.js';
import { createUserSchema } from '../validators/user.validate.js';
import { authenticateToken } from '../middlewares/authenticate.js';
// Importar el controlador de usuarios y el validador
const router = Router();

// Importar controladores simpre
// router.get('/', usersController.getUsers);
// router.post('/', usersController.createUser);
// Aquí puedes agregar más rutas relacionadas con los usuarios, como actualizar o eliminar usuarios
router.route('/')
  .get(usersController.getUsers) // Obtener todos los usuarios
  .post(validate(createUserSchema, 'body'), usersController.createUser); // Crear un nuevo usuario
  //.put(usersController.updateUser) // Actualizar usuario
  //.delete(usersController.deleteUser); // Eliminar usuario

router.route('/:id')
  .get(authenticateToken, usersController.getUser) // Obtener un usuario por ID
  .put(authenticateToken, usersController.updateUser) // Actualizar un usuario por ID
  .delete(authenticateToken, usersController.deleteUser) // Eliminar un usuario por ID
  .patch(authenticateToken, usersController.activeInactivatedUser); // Activar o desactivar un usuario por ID

  router.get('/:id/tasks', authenticateToken, usersController.getTasks); // Obtener tareas de un usuario por ID


router.route('/list/pagination')
  .get(usersController.getList);
export default router;