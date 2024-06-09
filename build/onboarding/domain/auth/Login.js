"use strict";
const { attributes } = require('structure');
const Login = attributes({
    email: {
        type: String,
        required: true,
        email: true
    },
    password: {
        type: String,
        required: true
    }
})(class Login {
});
module.exports = Login;
