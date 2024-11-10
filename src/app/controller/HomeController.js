const Task = require("../model/Task");
const { mutipleMongooseToObject } = require("../../util/mongose");

class HomeController {

    // [GET] /todo-note
    index(req, res, next) {
        var isEmpty;
        Task.find({ isCompleted: false, userId: req.session.userId })
            .populate('tagId', 'category')
            .sort({ createdAt: -1 })
            .limit(5)
            .then(tasks => {
                if (tasks.length < 5) {
                    isEmpty = false;
                } else {
                    isEmpty = true;
                }
                res.render('home', {
                    isEmpty,
                    tasks: mutipleMongooseToObject(tasks)
                });
            })
            .catch(next);
    };

}

module.exports = new HomeController;