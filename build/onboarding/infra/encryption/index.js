"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Encryption_SALT;
const bcrypt = require('bcrypt');
class Encryption {
    constructor() {
        _Encryption_SALT.set(this, 10);
    }
    encrypt(value) {
        return bcrypt.hashSync(value, __classPrivateFieldGet(this, _Encryption_SALT, "f"));
    }
    compare(value, encryptedValue) {
        return bcrypt.compareSync(value, encryptedValue);
    }
}
_Encryption_SALT = new WeakMap();
module.exports = Encryption;
