import joi from 'joi';

export const createUserSchema = joi.object({
    username: joi.string().min(3).max(50).required(),
    password: joi.string().min(6).max(100).required(),
    status: joi.string().valid('active', 'inactive', 'suspended').default('active')
});