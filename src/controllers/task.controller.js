import { Task } from "../models/task.js";

async function getTasks(req, res, next) {
    const { userId } = req.user;
    try {
        const tasks = await Task.findAll({
            attributes: ["id", "name", "done"],
            order: [[ 'name', 'ASC' ]],
            where: {
                userId
            } 
        });

        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        next(error); // Pasar el error al middleware de manejo de errores
    }
}

async function taskDone(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;
    const { done } = req.body;
    try {
        const task = await Task.update(
            { done },
            {
                where: {
                    id,
                    userId
                }
            }
        );

        if (!task || task[0] === 0) {
            return res.status(404).json({ message: "Tarea no encontrada o no actualizada" });
        }

        res.json({ message: "Tarea actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
        next(error);
    }
}

async function createTask(req, res, next) {
    const { userId } = req.user;
    const { name } = req.body;
    try {
        const newTask = await Task.create({
            name,
            userId
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);
        next(error);
    }
}

async function getTask(req, res, next) {
    const { userId } = req.user;
    const { id } = req.params;

    try {
        const task = await Task.findOne({
            attributes: ["name", "done"],
            where: {
                id,
                userId
            }
        });

        if (!task) {
            res.status(404).json({ message: "Tarea no encontrada" });
        }

        res.json(task);
    } catch (error) {
        console.error("Error al encontrar la tarea:", error);
        next(error);
    }
}

async function updateTask(req, res, next) {
    const { userId } = req.user;
    const { id } = req.params;
    const { name } = req.body;

    try {
        const task = await Task.update(
            {
                name
            },
            {
                where: {
                    id,
                    userId
                }
            }
        );

        if ((!task || task[0] === 0)) {
            return res.status(404).json({ message: "Tarea no encontrada o no actualizada" });
        }
        res.json(task);
    } catch (error) {
        console.error("Error updating task:", error);
        next(error);
    }
}

async function deleteTask(req, res, next) {
    const { userId } = req.user;
    const { id } = req.params;

    try {
        const task = await Task.destroy({
            where: {
                id,
                userId
            }
        });

        if ((!task || task === 0)) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        console.error("Error al borrar la tarea:", error);
        next(error);
    }
}

export default { 
    getTasks,
    createTask,
    getTask,
    updateTask,
    taskDone,
    deleteTask
};