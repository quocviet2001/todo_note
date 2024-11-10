const Task = require("../model/Task");

const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.session.role)) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập vào tài nguyên này !' });
        }
        next();
    };
};

const checkOwnership = (req, res, next) => {
    const taskId = req.params.id;
    Task.findById(taskId)
        .then(task => {
            if (!task || task.userId.toString() !== req.session.userId) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
            }
            next();
        })
        .catch(next);
};

const checkOwnershipTrash = (req, res, next) => {
    Task.findWithDeleted({ deleted: true, _id: req.params.id })
        .then(task => {
            if (!task[0] || task[0].userId.toString() !== req.session.userId) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
            }
            next();
        })
        .catch(next);
};

const checkOwnershipHandleAction = (req, res, next) => {
    const taskId = req.body.tasksIds[0];
    Task.findById(taskId)
        .then(task => {
            if (!task || task.userId.toString() !== req.session.userId) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
            }
            next();
        })
        .catch(next);
};

const checkOwnershipHandleActionTrash = (req, res, next) => {
    Task.findWithDeleted({ deleted: true, _id: req.body.tasksIds[0] })
        .then(task => {
            if (!task[0] || task[0].userId.toString() !== req.session.userId) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
            }
            next();
        })
        .catch(next);
};

module.exports = {
    authorize,
    checkOwnership,
    checkOwnershipTrash,
    checkOwnershipHandleAction,
    checkOwnershipHandleActionTrash,
};
