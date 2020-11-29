const router = require('express').Router();
const passport = require('passport');

const userValidator = require('../utils/validation');
const User = require('../models/User');
const { sendLink } = require('../utils/mail');
const { ensureGuest, ensureUser } = require('../middlewares/auth');

router.use('/auth', require('./auth'));

// @route   GET /
// @desc    Home Page
router.get('/', (req, res) => res.status(200).render('index'));

// @route   GET /signup
// @desc    Sign Up Page
router.get('/signup', ensureGuest, (req, res) =>
    res.status(200).render('signup')
);

// @route   POST /signup
// @desc    Create User With Email and Password
router.post('/signup', ensureGuest, async (req, res) => {
    const { email, name, password, password2 } = req.body;

    const v = userValidator(name, email, password, password2);

    if (!v.isValid) {
        return res.render('signup', {
            error: v.error_msg,
            email,
            password,
            name,
        });
    }

    try {
        let user = await User.findOne({
            email: v.data.email,
        });

        if (user) {
            return res.render('signup', {
                error: 'Email Already registered.',
                email,
                password,
                name,
            });
        }

        user = await User.create({
            email: v.data.email,
            password: v.data.password,
            name: v.data.name,
            provider: 'local',
        });

        const m = await sendLink(user);

        if (m.success) {
            return res.status(200).render('signup', {
                success: 'User Created. Check Email for account verificaton.',
            });
        }

        await user.deleteOne();
        return res.status(500).send('<h1>Server Error</h1>');
    } catch (err) {
        console.log(err);
        return res.status(5000).send('<h1>500 Server Error</h1>');
    }
});

// @route   GET /login
// @desc    Log In Page
router.get('/login', ensureGuest, (req, res) =>
    res.status(200).render('login')
);

// @route   POST /login
// @desc    Log In Handle
router.post(
    '/login',
    ensureGuest,
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })
);

// @route   GET /dashboard
// @desc    Dashboard
router.get('/dashboard', ensureUser, (req, res) =>
    res.status(200).render('dashboard')
);

// @route   POST /logout
// @desc    Log Out
router.post('/logout', ensureUser, (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out');
    res.redirect('/login');
});

module.exports = router;
