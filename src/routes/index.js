const homeRouter = require("./home");
const siteRouter = require("./site");
const tasksRouter = require("./tasks");
const meRouter = require("./me");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const {authorize} = require('../app/middleware/authorizeMiddleware');
const {protectRouteSession} = require("../app/middleware/authenticateSessionMiddleware");

function route(app) {
    app.use("/auth", authRouter);
    app.use("/admin", authorize(['Admin']),adminRouter);
    app.use("/me",protectRouteSession,meRouter);
    app.use("/todo-note",homeRouter);
    app.use("/tasks",protectRouteSession,tasksRouter);
    app.use("/", siteRouter);
}

module.exports = route;