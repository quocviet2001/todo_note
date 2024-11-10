const express = require('express');
const port = 3001;
const app = express();
const path = require('path');
const route = require("./routes");
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const db = require('./config/db');
const sortMiddleware = require('./app/middleware/SortMiddleware');
const { isLoggedIn } = require('./app/middleware/authenticateSessionMiddleware');

//Use session for authentication
app.use(session({
    secret: 'vit_charlie_201@#$',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        httpOnly: true,
        secure: false
    }
}));

// Use Middleware
app.use(express.urlencoded({ extended: true })); // Used to get data from the submitted form (req.body)
app.use(express.json());
app.use(methodOverride('_method')); // Override method POST, GET --> PUT, DELETE
app.use(sortMiddleware); // Use to sort list - created by custom.
app.use(isLoggedIn); // Used to display the login interface.

// Template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: require('./helpers/handlebar'),
}
));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

// Static file
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//Connect to DB
db.connect();

route(app);

app.listen(port, '0.0.0.0', () => {
    console.log(`Todo Note is running on http://0.0.0.0:${port}`);
});