"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AuthManagementService_userRepository, _AuthManagementService_encryptionService, _AuthManagementService_jwtService;
const Login = require('../../domain/auth/Login');
const { ValidationError } = require('../../shared/errors/ErrorValidation');
class AuthManagementService {
    constructor({ repository: { userRepository }, encryptionService, jwtService }) {
        _AuthManagementService_userRepository.set(this, void 0);
        _AuthManagementService_encryptionService.set(this, void 0);
        _AuthManagementService_jwtService.set(this, void 0);
        __classPrivateFieldSet(this, _AuthManagementService_userRepository, userRepository, "f");
        __classPrivateFieldSet(this, _AuthManagementService_encryptionService, encryptionService, "f");
        __classPrivateFieldSet(this, _AuthManagementService_jwtService, jwtService, "f");
    }
    login(loginParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = loginParams;
            const login = new Login({ email, password });
            let { valid, errors } = login.validate();
            if (!valid) {
                throw new ValidationError('Email or password not provided', errors);
            }
            const user = yield __classPrivateFieldGet(this, _AuthManagementService_userRepository, "f").findOneBy({ email: login.email });
            if (!user) {
                throw new ValidationError('Email or password is invalid');
            }
            valid = __classPrivateFieldGet(this, _AuthManagementService_encryptionService, "f").compare(login.password, user.password);
            if (!valid) {
                throw new ValidationError('Email or password is invalid');
            }
            const authToken = __classPrivateFieldGet(this, _AuthManagementService_jwtService, "f").encode(user.tokenizablePayload());
            return authToken;
        });
    }
}
_AuthManagementService_userRepository = new WeakMap(), _AuthManagementService_encryptionService = new WeakMap(), _AuthManagementService_jwtService = new WeakMap();
module.exports = AuthManagementService;
