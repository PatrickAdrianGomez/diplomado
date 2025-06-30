import { comparePassword } from "../common/bcrypt.js";
import { User } from "../models/user.js";
import jwt from 'jsonwebtoken';
import configs from "../config/env.js";

async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "El usuario y la contraseña son campos requeridos." });
        }
        const user = await User.findOne({ where: { username } });
        if (!user) {
            res.status(403).json({ message: "El usuario no fue encontrado." });
        }
        comparePassword(password, user.password)
            .then(isMatch => {
                if (!isMatch) {
                    res.status(403).json({ message: "El usuario no fue encontrado." });
                }
                // Aquí puedes generar un token JWT o realizar cualquier otra acción necesaria
                const token = jwt.sign(
                    { userId: user.id, username: user.username }, 
                    configs.JWT_SECRET, 
                    { expiresIn: configs.JWT_EXPIRATION_TIME_SECONDS || '1h' }
                );
                res.json({ message: "Inicio de sesión exitoso", token });
            })
            .catch(err => {
                console.error("Error al comparar contraseñas:", err);
                res.status(500).json({ message: "Error interno del servidor" });
            });
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
        console.error("Error en el controlador de inicio de sesión:", error);
    }
}

export default { login };