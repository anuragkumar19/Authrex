const { Schema, model } = require('mongoose');
const { v4 } = require('uuid');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    provider: {
        type: String,
        enum: ['google', 'local', 'facebook'],
        required: true,
    },

    googleId: {
        type: String,
        required: function () {
            return this.provider == 'google';
        },
    },

    facebookId: {
        type: String,
        required: function () {
            return this.provider == 'facebook';
        },
    },

    password: {
        type: String,
        required: function () {
            return this.provider == 'local';
        },
    },

    image: {
        type: String,
        default: '/img/user.png',
        required: true,
    },

    verified: {
        type: Boolean,
        required: true,
        default: function () {
            if (this.provider == 'local') {
                return false;
            }
            return true;
        },
    },

    verificationSecret: {
        type: String,
        required: function () {
            return this.provider == 'local';
        },
        default: function () {
            if (this.provider == 'local') {
                return v4();
            }

            return undefined;
        },
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('User', userSchema);
