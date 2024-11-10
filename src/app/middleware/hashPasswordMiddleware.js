const bcrypt = require('bcrypt');

module.exports = function hashPasswordMiddleware(req, res, next) {
    const { password } = req.body;
    if (password) {
        bcrypt
            .hash(password, 10)
            .then(hashedPassword => {
                req.body.password = hashedPassword;
                next();
            })
            .catch(error => next(error));
    } else {
        next();
    }
};