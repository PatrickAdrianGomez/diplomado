export default function notFound(req, res, next) {
    res.status(404).json({
        message: 'No encontrado',
        error: 'La petición del recurso no pudo ser procesada porque no existe en el servidor.',
    });
}