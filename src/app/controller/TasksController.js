const Task = require("../model/Task");
const Tag = require("../model/Tag");
const { format, parse } = require('date-fns');
const { mongooseToObject, mutipleMongooseToObject } = require("../../util/mongose");

class TasksController {

    // [GET] /
    index(req, res) {
        res.render('other');
    };

    // [GET] /tasks/:slug
    detail(req, res, next) {
        Task.findOne({ slug: req.params.slug })
            .populate('tagId', 'category')
            .then(task => {
                if (!task || task.userId.toString() !== req.session.userId) {
                    return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
                }
                res.render("tasks/detail-task", {
                    task: mongooseToObject(task)
                })
            })
            .catch(next);
    };

    // [GET] /tasks/create
    create(req, res, next) {
        Tag.find({})
            .then(tags => {
                res.render('tasks/create', {
                    tags: mutipleMongooseToObject(tags)
                })
            })
            .catch(next);
    };

    // [POST] /tasks/save-list
    saveList(req, res, next) {
        if (!req.body.dueDate) {
            const now = new Date();
            now.setHours(23, 0, 0, 0);
            req.body.dueDate = now;
            req.body.dueDate = format(req.body.dueDate, 'HH:mm dd-MM-yyyy');
        };

        const userId = req.session.userId;
        req.body.dueDate = parse(req.body.dueDate, 'HH:mm dd-MM-yyyy', new Date());
        const task = new Task({ ...req.body, userId });
        
        task.save()
            .then(() => res.redirect('/me/mylist'))
            .catch(next);
    };

    //[GET] /tasks/:id/edit
    edit(req, res, next) {
        Promise.all([Tag.find({}), Task.findById(req.params.id).populate('tagId', 'category')])
            .then(([tags, task]) => {
                res.render('tasks/edit', {
                    tags: mutipleMongooseToObject(tags),
                    task: mongooseToObject(task)
                })

            })
            .catch(next);
    };

    //[PUT] /tasks/:id/update
    update(req, res, next) {
        req.body.dueDate = parse(req.body.dueDate, 'HH:mm dd-MM-yyyy', new Date());
        Task.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/mylist'))
            .catch(next);
    };

    //[GET] tasks/search
    search(req, res, next) {
        const { keyword } = req.query;
        Task.find({
            title: { $regex: keyword, $options: "i" },
            userId: req.session.userId,
            isCompleted: false,
        })
            .populate('tagId', 'category')
            .then(tasks => {
                res.render('me/mylist', {
                    tasks: mutipleMongooseToObject(tasks),
                    page: `Kết quả tìm kiếm cho "${keyword}"`,
                    hide: true,
                })
            })
            .catch(next);
    };

    //[DELETE] /tasks/:id
    delete(req, res, next) {
        Task.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    };

    //[DELETE] /tasks/:id/destroy
    destroy(req, res, next) {
        Task.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/me/trash-task'))
            .catch(next);
    };

    // [PATCH] /tasks/:id/restore
    restore(req, res, next) {
        Task.restore({ _id: req.params.id })
            .then(() => res.redirect('/me/trash-task'))
            .catch(next);
    };

    //[PATCH] tasks//:id/completed
    completed(req, res, next) {
        Task.findByIdAndUpdate({ _id: req.params.id }, {
            status: "Hoàn thành",
            isCompleted: true,
            completedAt: Date.now(),
        })
            .then(() => {
                res.redirect('back')
            })
            .catch(next);
    };

    //[POST] /tasks/:id/undo
    unDo(req, res, next) {
        Task.findByIdAndUpdate({ _id: req.params.id }, {
            status: "Chưa hoàn thành",
            isCompleted: false,
            completedAt: null,
        })
            .then(() => {
                res.redirect('/me//history-task')
            })
            .catch(next);
    };

    //[POST] /tasks/handle-action
    handleAction(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Task.delete({ _id: { $in: req.body.tasksIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'complete':
                Task.updateMany(
                    { _id: { $in: req.body.tasksIds } },
                    {
                        status: "Hoàn thành",
                        isCompleted: true,
                        completedAt: Date.now(),
                    }
                )
                    .then(() => {
                        res.redirect('/me/mylist');
                    })
                    .catch(next);
                break;
            case 'undo':
                Task.updateMany({ _id: { $in: req.body.tasksIds } }, {
                    status: "Chưa hoàn thành",
                    isCompleted: false,
                    completedAt: null,
                })
                    .then(() => {
                        res.redirect('back');
                    })
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid !!!' });
        }
    };

    //[POST] /tasks/trash-handle-action
    trashHandleAction(req, res, next) {
        switch (req.body.action) {
            case 'restore':
                Task.restore({ _id: { $in: req.body.tasksIds } }, req.body)
                    .then(() => res.redirect('/me/trash-task'))
                    .catch(next);
                break;
            case 'destroy':
                Task.deleteMany({ _id: { $in: req.body.tasksIds } })
                    .then(() => res.redirect('/me/trash-task'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid !!!' });
        }
    };

}

module.exports = new TasksController;