import { User } from "../models/user.js";
import { Task } from "../models/task.js";
import logger from "../logs/logger.js";
import { Status } from "../constants/index.js";
import { hash } from "bcrypt";
import { hashPassword } from "../common/bcrypt.js";
import { Op } from "sequelize";
/**
 * Controlador para manejar las operaciones relacionadas con los usuarios.
 * Este controlador incluye una función para obtener todos los usuarios con sus tareas asociadas.
 */

async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      //include: [{
        attributes: ['id', 'username', 'status'], // Especifica los atributos que quieres incluir
        order: [['createdAt', 'DESC']], // Ordenar por fecha de creación, de más reciente a más antiguo
        // Puedes agregar más atributos si es necesario
        where: {
          status: Status.ACTIVE, // Filtrar por estado activo
        }
      //}],
    });
    res.json(users);
  } catch (error) {
    //console.error("Error al obtener los usuarios:", error);
    logger.error("Error al obtener los usuarios:", error);
    // Manejo de errores
    //return res.status(500).json({ message: "Error interno del servidor" });    
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

async function createUser(req, res) {
  console.log("Creando un nuevo usuario");
  try {
    const { username, password } = req.body; //esto es una desestructuración de objeto
    const newUser = await User.create({ username, password });
    res.status(201).json(newUser);
  } catch (error) {
    //console.log("Error al crear el usuario:", error);
    logger.error("Error al crear el usuario:", error);
    //return res.status(500).json({ message: "Error interno del servidor" });
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

async function getUser(req, res, next) {
  const { id } = req.params;
  console.log("Obteniendo usuario con ID:", id);
  try {
    const user = await User.findOne({
      where: { id },
      //include: [{
        attributes: ['username', 'password', 'status'], // Especifica los atributos que quieres incluir
      //}]
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    //console.error("Error al obtener el usuario:", error);
    //logger.error("Error al obtener el usuario:", error);
    // Manejo de errores
    //return res.status(500).json({ message: "Error interno del servidor" });
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

async function getList(req, res, next) {
  // Implementar la lógica para obtener una lista de usuarios con paginación
  // Puedes usar User.findAndCountAll() para obtener la lista y el conteo total
  // Ejemplo de paginación con Sequelize
  // Aquí se asume que tienes un modelo User y que estás usando Sequelize como ORM
  const { page = 1, limit = 5 } = req.query; // Obtener los parámetros de paginación
  const offset = (page - 1) * limit; // Calcular el offset para la paginación
  const { search = '' } = req.query; // Obtener el término de búsqueda, si existe req.query.search
  const {orderBy = 'username', orderDir = 'DESC'} = req.query; // Obtener el ordenamiento, si existe

  if (orderDir !== 'ASC' && orderDir !== 'DESC') {
    return res.status(400).json({ message: "Dirección de ordenamiento inválida" });
  }

  if (orderBy !== 'id' && orderBy !== 'username' && orderBy !== 'status') {
    return res.status(400).json({ message: "Campo de ordenamiento inválido, debe ser id, username o status" });
  }

  if (limit < 5 || limit > 20) {
    return res.status(400).json({ message: "El límite debe estar entre 5 y 20" });
  }
  
  try {
    const { count, rows } = await User.findAndCountAll({
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      order: [[orderBy, orderDir]], // Ordenar por fecha de creación, de más reciente a más antiguo
      where: {
        // Puedes agregar más condiciones de búsqueda aquí
        username: { [Op.iLike]: `%${ search || ''}%` }, // Filtrar por nombre de usuario (opcional)
        status: Status.ACTIVE, // Filtrar por estado activo
      }
    });
    // total de paginas segun el limite
    const pages = Math.ceil(count / limit); // Calcular el número total de páginas
    
    res.json({ total: count, page:page, pages: pages, users: rows });
  } catch (error) {
    //console.error("Error al obtener la lista de usuarios:", error);
    //logger.error("Error al obtener la lista de usuarios:", error);
    // Manejo de errores
    //return res.status(500).json({ message: "Error interno del servidor" });
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await User.destroy({ where: { id } });
    res.status(204).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    //console.error("Error al eliminar el usuario:", error);
    //logger.error("Error al eliminar el usuario:", error);
    // Manejo de errores
    //return res.status(500).json({ message: "Error interno del servidor" });
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

async function updateUser(req, res, next) {
  // Implementar la lógica para actualizar un usuario
  // Puedes usar User.update() para actualizar los campos necesarios
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    /*const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }*/
   if(!username || !password) {
      return res.status(400).json({ message: "Faltan datos para actualizar el usuario" });
    }

    const passwordEncriptado = await hashPassword(password);
    // Actualizar el usuario con los nuevos datos
    const user = await User.update(
      { username, password: passwordEncriptado },
      { where: { id }, returning: true } // 'returning: true' devuelve el usuario actualizado
    );

    res.json(user[1][0]); // user[1] contiene los usuarios actualizados, y [0] es el primer usuario actualizado
  } catch (error) {
    //console.error("Error al actualizar el usuario:", error);
    //logger.error("Error al actualizar el usuario:", error);
    // Manejo de errores
    //return res.status(500).json({ message: "Error interno del servidor" });
    next(error); // Pasar el error al middleware de manejo de errores
    
  }
}

async function activeInactivatedUser(req, res) {
  // Implementar la lógica para activar o desactivar un usuario
  // Puedes usar User.update() para cambiar el estado del usuario
  const { id } = req.params;
  const { status } = req.body; // Espera un campo 'status' en el cuerpo de la solicitud
  try {
    if (!status || ![Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED].includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    let user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.status === status) {
      return res.status(400).json({ message: `El usuario ya está ${status}` });
    }

    user = await User.update(
      { status },
      { where: { id }, returning: true } // 'returning: true' devuelve el usuario actualizado
    );

    res.json(user[1][0]); // user[1] contiene los usuarios actualizados, y [0] es el primer usuario actualizado
  } catch (error) {
    //console.error("Error al actualizar el estado del usuario:", error);
    //logger.error("Error al actualizar el estado del usuario:", error);
    // Manejo de errores
    //return res.status(500).json({ message: "Error interno del servidor" });
    next(error); // Pasar el error al middleware de manejo de errores
  }
} 

async function getTasks(req, res, next) {
  const { id } = req.params; // ID del usuario
  console.log("Obteniendo tareas para el usuario con ID:", id);
  try {
    const user = await User.findOne({
      attributes: ['username'],
      include: [
        {
          model: Task,
          attributes: ['name', 'done'],
          /*where: {
            done: true // Filtrar solo las tareas completadas
          }*/
        }
      ],
      where: { id }
    });
    res.json(user);
  } catch (error) {
    //console.error("Error al obtener las tareas del usuario:", error);
    //logger.error("Error al obtener las tareas del usuario:", error);
    // Manejo de errores
    //return res.status(500).json({ message: "Error interno del servidor" });
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

export default {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getTasks,
    activeInactivatedUser,
    getList
}