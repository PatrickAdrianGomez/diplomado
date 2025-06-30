import { Sequelize } from "sequelize"; // Importar Sequelize desde el paquete sequelize
import configs from "../config/env.js"; // Asegúrate de que la ruta sea correcta

export const sequelize = new Sequelize(
    configs.DB_DATABASE,
    configs.BD_USER,
    configs.DB_PASSWORD,
    {
        host: configs.DB_HOST,
        dialect: configs.DB_DIALECT, // Por ejemplo, 'mysql', 'postgres', 'sqlite', etc.
        port: configs.DB_PORT,
        logging: false // Desactivar logs de SQL
    }
);