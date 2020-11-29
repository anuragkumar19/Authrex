const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = function (passport) {
    // Local Strategy
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({
                        email,
                    });

                    if (!user)
                        return done(null, false, {
                            message: 'User not registered.',
                        });

                    if (user.provider != 'local')
                        return done(null, false, {
                            message: `It's Look like you used ${user.provider} for sign in. Please use ${user.provider} to login.`,
                        });

                    if (!user.verified)
                        return done(null, false, {
                            message: `Your Account is not verified.`,
                        });

                    if (!bcrypt.compareSync(password, user.password))
                        return done(null, false, {
                            message: `Incorrect Password.`,
                        });

                    return done(null, user);
                } catch (err) {
                    console.log(err);
                    return done(null, false, {
                        message: 'Server Error',
                    });
                }
            }
        )
    );

    // Google Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                const { id, displayName: name, emails, photos } = profile;

                try {
                    let user = await User.findOne({ email: emails[0].value });

                    if (user) {
                        if (user.provider != 'google')
                            return done(
                                null,
                                false,
                                `It's Look like you used ${
                                    user.provider == 'local'
                                        ? 'Email & Passsword'
                                        : user.provider
                                } for sign in. Please use ${
                                    user.provider == 'local'
                                        ? 'Email & Passsword'
                                        : user.provider
                                } to login.`
                            );

                        return done(null, user);
                    } else {
                        user = await User.findOne({
                            googleId: id,
                        });

                        if (user) return done(null, user);

                        user = await User.create({
                            name,
                            provider: 'google',
                            googleId: id,
                            email: emails[0].value,
                            image: photos[0].value,
                        });

                        return done(null, user);
                    }
                } catch (err) {
                    console.log(err);
                    return done(null, false, 'Server Error.');
                }
            }
        )
    );

    // Facebook Strategy
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: '/auth/facebook/callback',
                profileFields: ['id', 'displayName', 'photos', 'email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                const { displayName, photos, emails, id } = profile;

                if (emails && emails[0] && emails[0].value) {
                    const email = emails[0].value;

                    let image;

                    if (photos && photos[0] && photos[0].value) {
                        image = photos[0].value;
                    }

                    try {
                        let user = await User.findOne({ email });

                        if (user) {
                            if (user.provider != 'facebook')
                                return done(
                                    null,
                                    false,
                                    `It's Look like you used ${
                                        user.provider == 'local'
                                            ? 'Email & Passsword'
                                            : user.provider
                                    } for sign in. Please use ${
                                        user.provider == 'local'
                                            ? 'Email & Passsword'
                                            : user.provider
                                    } to login.`
                                );

                            return done(null, user);
                        }

                        user = await User.findOne({
                            facebookId: id,
                        });

                        if (user) return done(null, user);

                        user = await User.create({
                            name: displayName,
                            provider: 'facebook',
                            email,
                            image,
                            facebookId: id,
                        });

                        return done(null, user);
                    } catch (err) {
                        console.log(err);
                        return done(null, false, 'Server Error.');
                    }
                } else {
                    return done(
                        null,
                        false,
                        'Please give access to your email.'
                    );
                }
            }
        )
    );

    // Serialize and deserialize user
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
