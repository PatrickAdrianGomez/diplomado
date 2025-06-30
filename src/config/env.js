const configs = {
    PORT: process.env.PORT ?? 3000,
    DB_HOST: process.env.DB_HOST,
    BD_USER: process.env.BD_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_DIALECT: process.env.DB_DIALECT,
    DB_PORT: process.env.DB_PORT,

    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) ?? 10,
    JWT_SECRET: process.env.JWT_SECRET, //requireEnv('JWT_SECRET')
    JWT_EXPIRATION_TIME_SECONDS: parseInt(process.env.JWT_EXPIRATION_TIME_SECONDS) || 3600 // 1 hour
};

const requiredEnv = (key) => {
    const value = process.env[key];
    if (value === undefined) { //!value
        throw new Error(`La variable de entorno ${key} no fue definida`);
    }
    return value;
};

export default configs;