"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { createContainer, asValue, asFunction, asClass } = require('awilix');
const Config = require('../config');
const Database = require('./infra/database');
const Logger = require('./infra/logger');
const Repository = require('./infra/repository');
const Application_1 = __importDefault(require("./interfaces/http/Application"));
const Encryption = require('./infra/encryption');
const MailProvider = require('./infra/mail/mailProvider');
const JWT = require('./infra/jwt');
// Application Services
const UserManager_1 = __importDefault(require("./app/user/UserManager"));
const { AuthManagementService } = require('./app/auth');
// Controllers
const UserController_1 = __importDefault(require("./interfaces/http/controller/UserController"));
// Events/Event Subscribers
const Subscribers = require('./domain/events/subscribers');
const EVENTS = require('./domain/events/events');
const EventEmitter = require('./infra/events/EventEmitter');
const container = createContainer();
container.register({
    app: asClass(Application_1.default).singleton(),
    config: asValue(Config),
    database: asFunction(Database).singleton(),
    logger: asFunction(Logger),
    repository: asFunction(Repository).singleton(),
    encryptionService: asClass(Encryption).singleton(),
    jwtService: asClass(JWT).singleton(),
    mailProvider: asClass(MailProvider).singleton(),
    // Application Services
    userManager: asClass(UserManager_1.default).singleton(),
    authManagementService: asClass(AuthManagementService).singleton(),
    // HTTP Controllers
    userController: asClass(UserController_1.default).singleton(),
    // Events/Event Subscribers
    subscribers: asFunction(Subscribers).singleton(),
    EVENTS: asValue(EVENTS),
    eventEmitter: asClass(EventEmitter).singleton()
    // Domain Services
});
exports.default = container;
