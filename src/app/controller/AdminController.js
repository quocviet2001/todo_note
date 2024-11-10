const Tag = require("../model/Tag");

class AdminController {

    //[GET] /admin/dashboard
    dashboard(req, res, next) {
        res.send("Bảng điều khiển của Admin.")
    };

    //[POST] /admin/tag-create
    createTag(req, res, next) {
        const tag = new Tag(req.body);
        tag.save()
            .then(() => res.redirect('back'))
            .catch(next);
    };

}

module.exports = new AdminController;