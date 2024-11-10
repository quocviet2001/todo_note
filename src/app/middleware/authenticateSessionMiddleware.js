
const protectRouteSession = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

const isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        res.locals.isLoggedIn = true; 
        res.locals.userId = req.session.userId;
        res.locals.username = req.session.username;
        res.locals.role = req.session.role;
        res.locals.avatar = req.session.avatar;
    } else {
        res.locals.isLoggedIn = false; 
    }
    next();
};

module.exports = {
    protectRouteSession,
    isLoggedIn,
};