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
var _UserRepository_User;
const { DatabaseError } = require('../../../shared/errors/ErrorValidation');
const UserMapper = require('./userMapper');
class UserRepository {
    constructor({ User, logger }) {
        _UserRepository_User.set(this, void 0);
        this.logger = logger;
        __classPrivateFieldSet(this, _UserRepository_User, User, "f");
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield __classPrivateFieldGet(this, _UserRepository_User, "f").findAll();
                return users.map(UserMapper.toEntity);
            }
            catch (error) {
                this.logger.error(error);
                throw new DatabaseError('Error fetching users from DB');
            }
        });
    }
    findOneBy(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield __classPrivateFieldGet(this, _UserRepository_User, "f").findOne({ where: params });
                return UserMapper.toEntity(user);
            }
            catch (error) {
                this.logger.error(error);
                throw new DatabaseError('Error fetching users from DB with params');
            }
        });
    }
    existsBy(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield __classPrivateFieldGet(this, _UserRepository_User, "f").count(params);
            }
            catch (error) {
                this.logger.error(error);
                throw new DatabaseError('Error performing count operation');
            }
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbUser = yield __classPrivateFieldGet(this, _UserRepository_User, "f").create(user.toJSON());
                return UserMapper.toEntity(dbUser);
            }
            catch (error) {
                this.logger.error(error);
                throw new DatabaseError('Failed to persist user to DB');
            }
        });
    }
}
_UserRepository_User = new WeakMap();
module.exports = UserRepository;
