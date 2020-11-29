const router = require('express').Router();
const { default: validator } = require('validator');
const passport = require('passport');

const { ensureGuest } = require('../middlewares/auth');

const User = require('../models/User');

router.get('/verify', async (req, res) => {
    const { id, secret } = req.query;

    if (!id || !secret) return res.send('<h1>404 Not Found</h1>');
    if (!validator.isMongoId(id)) return res.send('<h1>404 Not Found</h1>');

    try {
        const user = await User.findById(id);
        if (!user) return res.send('<h1>404 Not Found</h1>');

        if (user.verificationSecret === secret) {
            user.verified = true;
            await user.save();
            return res.send('<h1>Account verified!</h1>');
        }

        return res.send('<h1>Failed to verify account</h1>');
    } catch (err) {
        console.log(err);
        return res.send('<h1>Server Error</h1>');
    }
});

router.get(
    '/google',
    ensureGuest,
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    ensureGuest,
    passport.authenticate('google', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

router.get(
    '/facebook',
    ensureGuest,
    passport.authenticate('facebook', { scope: ['email', 'user_photos'] })
);

router.get(
    '/facebook/callback',
    ensureGuest,
    passport.authenticate('facebook', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    function (req, res) {
        res.redirect('/dashboard');
    }
);

module.exports = router;
