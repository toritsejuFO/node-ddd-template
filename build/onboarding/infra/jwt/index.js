"use strict";
const jwt = require('jsonwebtoken');
class JWT {
    constructor({ config }) {
        this.config = config;
    }
    encode(payload, options = {}) {
        return jwt.sign(payload, this.config.jwt.secret, options);
    }
    verify(token, options = {}) {
        return jwt.verify(token, this.config.jwt.secret, options);
    }
}
module.exports = JWT;
