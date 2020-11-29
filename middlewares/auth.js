module.exports.ensureUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'Log in to view that resource.');
        res.redirect('/login');
    }
};

module.exports.ensureGuest = function (req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/dashboard');
    }
};

module.exports.userMiddleware = function (req, res, next) {
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();

    next();
};
