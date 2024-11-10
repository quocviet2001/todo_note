const mongoose = require('mongoose');
const Task = require("../model/Task");
const Tag = require("../model/Tag");
const User = require("../model/User");
const { mutipleMongooseToObject, mongooseToObject } = require("../../util/mongose");
const bcrypt = require('bcrypt');
const path = require('path');

class MeController {

    // [GET] /me/mylist
    mylist(req, res, next) {
        const tasksPerPage = 10;
        const pageCurrent = parseInt(req.query.page) || 1;
        Promise.all([
            Task.find({ isCompleted: false, userId: req.session.userId })
                .sortable(req)
                .populate('tagId', 'category')
                .skip((pageCurrent - 1) * tasksPerPage)
                .limit(tasksPerPage),
            Task.countDocumentsWithDeleted({ deleted: true, userId: req.session.userId }),
            Task.countDocuments({ isCompleted: false, userId: req.session.userId })
        ])
            .then(([tasks, deletedCount, totalTasks]) => {
                const totalPages = Math.ceil(totalTasks / tasksPerPage);
                res.render('me/mylist', {
                    page: 'Danh sách tất cả nhiệm vụ',
                    deletedCount,
                    tasks: mutipleMongooseToObject(tasks),
                    currentPage: pageCurrent,
                    totalPages,
                })
            })
            .catch(next);
    };

    // [GET] /me/trash-task
    trashTask(req, res, next) {
        const tasksPerPage = 10;
        const pageCurrent = parseInt(req.query.page) || 1;
        Promise.all([
            Task.findWithDeleted({ deleted: true, userId: req.session.userId })
                .skip((pageCurrent - 1) * tasksPerPage)
                .limit(tasksPerPage),
            Task.countDocumentsWithDeleted({ deleted: true, userId: req.session.userId })
        ])
            .then(([tasks, totalTasks]) => {
                const totalPages = Math.ceil(totalTasks / tasksPerPage);
                res.render('me/trash-task', {
                    tasks: mutipleMongooseToObject(tasks),
                    currentPage: pageCurrent,
                    totalPages,
                })
            })
            .catch(next);
    };

    // [GET] /me/my-tags
    myTags(req, res, next) {
        const userId = new mongoose.Types.ObjectId(req.session.userId);
        Promise.all([Task.countDocuments({ userId: userId, isCompleted: false }), Tag.aggregate([
            {
                $lookup: {
                    from: "tasks",
                    let: { tagId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$tagId", "$$tagId"] },      
                                        { $eq: ["$isCompleted", false] },     
                                        { $eq: ["$userId", userId] },        
                                        { $ne: ["$deleted", true] },
                                    ]
                                }
                            }
                        }
                    ],
                    as: "tasks"
                }
            },
            {
                $project: {
                    category: "$category",     
                    taskCount: { $size: "$tasks" } 
                }
            },
            {
                $project: {
                    category: 1,
                    taskCount: { $ifNull: ["$taskCount", 0] } 
                }
            }
        ])])
            .then(([taskCount, tags]) => {
                res.render('me/tags/mytags', { tags, taskCount });
            })
            .catch(next);
    }

    //[GET] /me/tags/:id
    detailTag(req, res, next) {
        const tasksPerPage = 10;
        const pageCurrent = parseInt(req.query.page) || 1;
        Promise.all([
            Task.find({ tagId: req.params.id, isCompleted: false, userId: req.session.userId })
                .sortable(req)
                .populate('tagId', 'category')
                .skip((pageCurrent - 1) * tasksPerPage)
                .limit(tasksPerPage),
            Tag.findById({ _id: req.params.id }),
            Task.countDocuments({ tagId: req.params.id, isCompleted: false, userId: req.session.userId })
        ])
            .then(([tasks, tag, totalTasks]) => {
                const totalPages = Math.ceil(totalTasks / tasksPerPage);
                res.render('me/mylist', {
                    tasks: mutipleMongooseToObject(tasks),
                    tag: mongooseToObject(tag),
                    page: `Danh mục "${tag.category}"`,
                    currentPage: pageCurrent,
                    totalPages,
                })
            })
            .catch(next);
    };

    //[GET] /me/history-task
    historyTask(req, res, next) {
        const tasksPerPage = 10;
        const pageCurrent = parseInt(req.query.page) || 1;
        Promise.all([
            Task.find({ isCompleted: true, userId: req.session.userId })
                .populate('tagId', 'category')
                .sortable(req)
                .skip((pageCurrent - 1) * tasksPerPage)
                .limit(tasksPerPage),
            Task.countDocuments({ isCompleted: true, userId: req.session.userId })
        ])
            .then(([tasks, totalTasks]) => {
                const totalPages = Math.ceil(totalTasks / tasksPerPage);
                res.render('me/mylist', {
                    page: 'Lịch sử nhiệm vụ',
                    hide: true,
                    historyTask: true,
                    tasks: mutipleMongooseToObject(tasks),
                    currentPage: pageCurrent,
                    totalPages,
                });
            })
            .catch(next);
    };

    //[GET] /me/profile
    profile(req, res, next) {
        User.findOne({ _id: req.session.userId })
            .then(user => {
                res.render('me/profile/user-information', {
                    user: mongooseToObject(user)
                })
            })
            .catch(next);
    };

    //[POST] /me/profile-update
    profileUpdate(req, res, next) {
        req.session.username = req.body.username;
        User.updateOne({ _id: req.session.userId }, req.body)
            .then(() => res.redirect('/me/profile'))
            .catch(next);
    };

    //[GET] /me/profile-avatar
    profileAvatar(req, res, next) {
        User.findOne({ _id: req.session.userId })
            .then(user => {
                res.render('me/profile/avatar', {
                    user: mongooseToObject(user)
                })
            })
            .catch(next);
    };

    //[POST] /me/update-avarta
    updateAvatar(req, res, next) {
        const avatarImage = '/uploads/' + req.file.filename;
        req.session.avatar = avatarImage;
        User.updateOne({ _id: req.session.userId }, { avatar: avatarImage })
            .then(user => {
                res.redirect('/me/profile');
            })
            .catch(next);
    };

    //[GET] /me/profile-password
    profilePassword(req, res, next) {
        res.render('me/profile/password-change')
    }

    //[POST] /me/change-password
    changePassword(req, res, next) {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const formData = req.body;
        const passwordValidation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

        if (!passwordValidation.test(newPassword)) {
            return res.render('me/profile/password-change', {
                formData,
                error: 'Mật khẩu mới phải có ít nhất 6 ký tự, bao gồm ít nhất 1 số và 1 ký tự đặc biệt.',
            });
        }

        if (newPassword !== confirmPassword) {
            return res.render('me/profile/password-change', {
                formData,
                error: 'Mật khẩu xác nhận không khớp.',
            });
        }

        if (newPassword === currentPassword) {
            return res.render('me/profile/password-change', {
                formData,
                error: 'Mật khẩu mới phải khác mật khẩu hiện tại.',
            });
        }

        User.findById(req.session.userId)
            .then(user => {
                return bcrypt.compare(currentPassword, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res.render('me/profile/password-change', {
                                formData,
                                error: "Mật khẩu hiện tại không đúng.",
                            })
                        }
                        return bcrypt.hash(newPassword, 10);
                    })
                    .then(hashedPassword => {
                        if (hashedPassword) {
                            user.password = hashedPassword;
                            return user.save();
                        }
                    });
            })
            .then(() => {
                res.render('me/profile/password-change', {
                    mess: "Thay đổi mật khẩu thành công.",
                })
            })
            .catch(next);
    };

}

module.exports = new MeController;