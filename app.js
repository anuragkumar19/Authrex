const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { userMiddleware } = require('./middlewares/auth');

// Init App
const app = express();

// Dotenv config
dotenv.config({
    path: 'config/.env',
});

// Connect to database
require('./config/db')();

// Passport config
require('./config/passport')(passport);

// View Engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Cookies Parser
app.use(cookieParser(process.env.SECRET));
// Express session
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        cookie: {
            maxAge: 60 * 60 * 24 * 90 * 1000,
        },
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Message
app.use(flash());
app.use(function (req, res, next) {
    res.locals.error_flash = req.flash('error');
    res.locals.success_flash = req.flash('success');

    next();
});

// Devlopment Middlewares
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

app.use(userMiddleware);

// Routes
app.use('/', require('./routes/index'));

// PORT
const PORT = process.env.PORT || 8000;

// Server listen
app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
    )
);
