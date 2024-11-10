class SiteController {

    // [GET] /
    index(req, res) {
        res.render("other");
    };

    //[GET] /login
    login(req, res, next) {
        res.render('acount/login')
    };

    //[GET] /sign-up
    signUp(req, res, next) {
        res.render('acount/sign-in')
    };

}

module.exports = new SiteController;