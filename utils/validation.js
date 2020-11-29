const { default: validator } = require('validator');
const bcrypt = require('bcryptjs');

module.exports = function (name, email, password, password2) {
    if (typeof name != 'string') {
        return {
            isValid: false,
            data: undefined,
            error_msg: 'Name Badly Formatted',
        };
    }

    if (typeof email != 'string') {
        return {
            isValid: false,
            data: undefined,
            error_msg: 'Email Badly Formatted',
        };
    }

    if (typeof password != 'string') {
        return {
            isValid: false,
            data: undefined,
            error_msg: 'Password Badly Formatted',
        };
    }

    if (typeof password2 != 'string') {
        return {
            isValid: false,
            data: undefined,
            error_msg: 'Confirm Password Badly Formatted',
        };
    }

    name = name.trim();
    email = email.trim();

    if (!name) {
        return {
            isValid: false,
            data: undefined,
            error_msg: 'Name Is Required',
        };
    }

    if (!email) {
        return {
            isValid: false,
            data: undefined,
            error_msg: 'Email Is Required',
        };
    }

    if (!password || password.length < 8) {
        return {
            isValid: false,
            data: undefined,
            error_msg: 'Password must be 8 character.',
        };
    }

    if (password !== password2) {
        return {
            isValid: false,
            data: undefined,
            error_msg: 'Password do not matched.',
        };
    }

    if (!validator.isEmail(email)) {
        return {
            isValid: false,
            data: undefined,
            error_msg: 'Email not valid.',
        };
    }

    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);

    return {
        isValid: true,
        data: {
            name,
            email,
            password: hash,
        },
    };
};
