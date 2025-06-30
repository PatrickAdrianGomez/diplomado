import bcrypt from 'bcrypt';
import configs from '../config/env.js';
import logger from '../logs/logger.js';

export const hashPassword = async (password) => {
    const salt = await configs.BCRYPT_SALT_ROUNDS;
    if (!salt) {
        throw new Error('BCRYPT_SALT_ROUNDS is not defined in the configuration');
    }
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        logger.error("Error al comparar las contraseñas:", error.message);
        throw new Error('Error comparing passwords: ' + error.message);
    }
}