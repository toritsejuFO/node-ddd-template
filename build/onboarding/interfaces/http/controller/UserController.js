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
const http_status_codes_1 = require("http-status-codes");
const ErrorValidation_1 = require("../../../shared/errors/ErrorValidation");
const ValidationError_1 = __importDefault(require("../../../shared/errors/ValidationError"));
class UserController {
    constructor(ctx) {
        this.userManager = ctx.userManager;
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userManager
                .getAllUsers()
                .then((users) => {
                return res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: users });
            })
                .catch((error) => next(error));
        });
    }
    createANewUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUserParams = req.body;
            return this.userManager
                .createANewUser(newUserParams)
                .then((user) => {
                return res
                    .status(http_status_codes_1.StatusCodes.CREATED)
                    .json({ success: true, data: user });
            })
                .catch((error) => {
                if ((0, ErrorValidation_1.isOfType)(error, ValidationError_1.default.name)) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: error.message,
                        error: error.error
                    });
                }
                return next(error);
            });
        });
    }
    getCurrentUser(req, res, next) {
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ success: true, data: req.user.serialize() });
    }
    getUserById(req, res, next) {
        const { userId } = req.params;
        this.userManager
            .getUserById(userId)
            .then((user) => {
            if (!user) {
                return res
                    .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                    .json({ success: false, message: 'User Not Found' });
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: user });
        })
            .catch((error) => next(error));
    }
}
exports.default = UserController;
