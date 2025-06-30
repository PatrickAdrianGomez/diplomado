import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Task = sequelize.define("tasks", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50], // Longitud mínima de 3 y máxima de 50 caracteres
            notNull: {
                msg: "El nombre de la tarea es obligatorio",
            },
        },
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Por defecto, la tarea no está completada
        allowNull: false,
    },
}/*, {
    timestamps: true, // Agrega createdAt y updatedAt
    tableName: 'tasks', // Nombre de la tabla en la base de datos
}*/);