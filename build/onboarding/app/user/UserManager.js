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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../domain/user/User"));
const ValidationError_1 = __importDefault(require("../../shared/errors/ValidationError"));
class UserManager {
    constructor(ctx) {
        this.userRepository = ctx.repository.userRepository;
        this.eventEmitter = ctx.eventEmitter;
        this.encryptionService = ctx.encryptionService;
        this.EVENTS = ctx.EVENTS;
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.findAll();
            return users.map((user) => user.serialize());
        });
    }
    createANewUser(newUserParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new User_1.default(newUserParams);
            const { valid, errors } = user.validate();
            if (!valid) {
                throw new ValidationError_1.default('Invalid user creation parameters', errors);
            }
            const existsByEmail = yield this.userRepository.existsBy({
                email: user.email
            });
            if (existsByEmail) {
                throw new ValidationError_1.default('User with email exists');
            }
            user.password = this.encryptionService.encrypt(user.password);
            const createdUser = yield this.userRepository.create(user);
            this.eventEmitter.emitEvent(this.EVENTS.NEW_USER_CREATED, createdUser.serialize());
            return createdUser.serialize();
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ userId });
            return user && user.serialize();
        });
    }
}
exports.default = UserManager;
