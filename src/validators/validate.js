function validate(schema, target = "body") {
    return (req, res, next) => {
        const data = req[target];
console.log("Los datos son:", data);
        // paso 1 verificar que haya datos
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "No se han proporcionado datos para validar" });
        }

        // paso 2 validar el schema con options
        const { error, value } = schema.validate(data, {
            abortEarly: false, // Para que devuelva todos los errores de validación
            allowUnknown: false, // Permite propiedades desconocidas
            stripUnknown: true, // Elimina propiedades desconocidas del objeto validado
        });

        // paso 3 si hay error, devolverlo
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({ 
                message: `Errores de validación en ${target}`,
                error: error.details.map(err => ({
                    message: err.message}))
            });
        }

        // paso 4 reemplazar los datos originales con los validados
        req[target] = value;
        next(); // Llamar al siguiente middleware o controlador
    };
}

export default validate;