import jwt from "jsonwebtoken";
// Importar la biblioteca jsonwebtoken para manejar tokens JWT
import configs from "../config/env.js";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtener el token del encabezado Authorization
    // Si el token no está presente, devolver un error 401
    if (!token) {
        return res.status(401).json({ message: "Token no encontrado" });
    }

    jwt.verify(token, configs.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido" });
        }
        req.user = user; // Guardar la información del usuario decodificada en la solicitud
        next(); // Pasar al siguiente middleware o controlador
    });
}