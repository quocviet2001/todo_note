const User = require("../model/User");
const bcrypt = require('bcrypt');

class AuthController {

    //[GET] /auth
    index(req, res, next) {
        res.send("Không tìm thấy trang!")
    };

    //[POST] /auth/register
    register(req, res, next) {
        const user = new User(req.body);
        user.save()
            .then(() => {
                res.render("acount/login", {
                    mess: 'Đăng ký thành công! Đăng nhập ngay.'
                });
            })
            .catch(next);
    };

    //[POST] /auth/login
    login(req, res, next) {

        const formData = req.body;
        const { email, password } = req.body;

        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return res.render("acount/login", {
                        wrong: 'Email không chính xác. Vui lòng thử lại!',
                        formData,
                    });
                }
                return bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res.render("acount/login", {
                                wrong: 'Mật khẩu không chính xác. Vui lòng thử lại!',
                                formData,
                            });
                        }
                        req.session.userId = user._id;
                        req.session.username = user.username;
                        req.session.role = user.role;
                        req.session.avatar = user.avatar;
                        res.redirect('/todo-note'); 
                    })
            })
            .catch(next);
    };

    //[POST] /auth/logout
    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/home');
            }
            res.redirect('/login');
        });
    };

}

module.exports = new AuthController;