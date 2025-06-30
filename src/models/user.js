import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Status } from "../constants/index.js";
import { Task } from "./task.js";
import { hashPassword } from "../common/bcrypt.js";

export const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 20], // Longitud mínima de 3 y máxima de 20 caracteres
            notNull: {
                msg: "El nombre de usuario es obligatorio",
            },
        },
        unique: {
            args: true,
            msg: "El nombre de usuario ya está en uso"
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100], // Longitud mínima de 6 y máxima de 100 caracteres
            notNull: {
                msg: "La contraseña es obligatoria",
            },
        },
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        allowNull: false,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE, Status.SUSPENDED]],
                msg: `El estado debe ser ${Status.ACTIVE}, ${Status.INACTIVE} o ${Status.SUSPENDED}`,
            },
        },
    },
}/*, {
    timestamps: true, // Agrega createdAt y updatedAt
    tableName: 'users', // Nombre de la tabla en la base de datos

}*/);

// Definir la relación entre User y Task de manera sencilla
// Un usuario puede tener muchas tareas, y una tarea pertenece a un usuario
User.hasMany(Task);
Task.belongsTo(User);

//Definir la relación entre User y Task de manera más compleja
// User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
// Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.beforeCreate(async (user) => {
    // Aquí puedes agregar lógica antes de crear un usuario, como encriptar la contraseña
    // Por ejemplo, si estás usando bcrypt:
    // user.password = await bcrypt.hash(user.password, 10);
    try {
        user.password = await hashPassword(user.password);
    } catch (error) {
        logger.error("Error al encriptar la contraseña:", error.message);
        next(error); // Pasar el error al middleware de manejo de errores
    }

});

User.beforeUpdate(async (user) => {
    try {
        user.password = await encriptarPassword(user.password);
    } catch (error) {
        logger.error("Error al encriptar la contraseña:", error.message);
        next(error); // Pasar el error al middleware de manejo de errores
    }
});