// todo lo que se use con express debe ir aqui
// como estamos usando modulos no podemos usar el const express = require('express')

import express from 'express';

const app = express();

// Importar las rutas
import authRoutes from './routes/auth.routers.js';
import usersRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import morgan from 'morgan'; // Middleware para registrar solicitudes HTTP
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import { authenticateToken } from './middlewares/authenticate.js';

// Importar middlewares
app.use(morgan('dev')); // Usar morgan para registrar solicitudes en la consola
app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las solicitudes

// Router para manejar las rutas de usuarios
app.use('/api/login', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

//const port = process.env.PORT || 3000;
//app.set('port', process.env.PORT);

app.use(notFound);
// Middleware para manejar rutas no encontradas
app.use(errorHandler);
// Middleware para manejar 
// número del inge 72414320 carlos ariel trigo vargas

export default app;