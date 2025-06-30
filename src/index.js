import 'dotenv/config.js'; // Cargar variables de entorno desde .env
import app from './app.js';
import logger from './logs/logger.js';
import config from './config/env.js'; // Asegurarse de que las variables de entorno estén configuradas
import { sequelize } from './database/database.js';

async function main() {
  try {
    await sequelize.sync({ force: false }); // Sincronizar la base de datos, forzar la creación de tablas
    console.log('Base de datos sincronizada correctamente');
    const puerto = config.PORT;
    app.listen(puerto);
    console.log(`Servidor funcionando en el puerto ${puerto}`);
    logger.info(`Servidor funcionando en el puerto ${puerto}`);
    logger.error(`Servidor funcionando en el puerto ${puerto}`);
    logger.warn(`Servidor funcionando en el puerto ${puerto}`);
    logger.fatal(`Servidor funcionando en el puerto ${puerto}`);
    logger.debug(`Servidor funcionando en el puerto ${puerto}`);
    logger.trace(`Servidor funcionando en el puerto ${puerto}`);
    
  } catch (error) {
    console.error('Error al levantar el servidor:', error);
  }
}

main();