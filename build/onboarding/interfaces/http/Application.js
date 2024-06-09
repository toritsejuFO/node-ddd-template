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
const express_1 = __importDefault(require("express"));
const Router_1 = __importDefault(require("./Router"));
class Application {
    constructor(ctx) {
        this.config = ctx.config;
        this.logger = ctx.logger;
        this.database = ctx.database;
        this.eventEmitter = ctx.eventEmitter;
        this.subscribers = ctx.subscribers;
        this.server = (0, express_1.default)();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.server.disable('x-powered-by');
            this.server.use(express_1.default.json());
            // Setup all routes
            Router_1.default.setupRoutes(this.server.bind(this));
            // Register all subscribers
            this.subscribers.map((s) => this.eventEmitter.registerSubscriber(s.EVENT, s.handler.bind(s)));
            // Start the database connection
            this.database.authenticate;
            // Start the server
            const { port } = this.config.app;
            this.server.listen(port, () => {
                this.logger.info('Server is listening on port %s', port);
            });
        });
    }
}
exports.default = Application;
