const { body, validationResult } = require('express-validator');
const User = require("../model/User");

const validateRegister = [
    body('username')
        .notEmpty().withMessage('Tên người dùng không được để trống')
        .isLength({ min: 3 }).withMessage('Tên người dùng phải có ít nhất 3 ký tự')
        .custom(async (value) => {
            const user = await User.findOne({ username: value });
            if (user) {
                throw new Error('Tên người dùng đã tồn tại');
            }
            return true;
        }),
    body('email')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('Email đã tồn tại');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/\d/).withMessage('Mật khẩu phải chứa ít nhất một chữ số')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Mật khẩu phải chứa ít nhất một ký tự đặc biệt'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('acount/sign-in', { errors: errors.array(), formData: req.body });
        }
        next();
    }
];

const validateLogin = [
    body('email')
        .isEmail().withMessage('Email không hợp lệ'),
    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('acount/login', { errors: errors.array(), formData: req.body });
        }
        next();
    }
];
module.exports = {
    validateRegister,
    validateLogin
};

