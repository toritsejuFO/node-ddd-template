"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller = require('./controller');
const middleware_1 = require("./middleware");
const USER_CONTROLLER = 'userController';
class Router {
    static setupRoutes(server) {
        server.use(middleware_1.routeLogger);
        server.get('/users', middleware_1.authGuard, (req, res) => req.scope.resolve(USER_CONTROLLER).getAllUsers(req, res));
        server.post('/user/create', middleware_1.authGuard, (req, res) => req.scope.resolve(USER_CONTROLLER).createANewUser(req, res));
        server.post('/user/create', middleware_1.authGuard, (req, res) => req.scope.resolve(USER_CONTROLLER).getCurrentUser(req, res));
        server.post('/user/create', middleware_1.authGuard, (req, res) => req.scope.resolve(USER_CONTROLLER).getUserById(req, res));
        server.use(controller('authController', { authGuard: middleware_1.authGuard }));
        server.use(middleware_1.invalidRouteHandler);
        server.use(middleware_1.errorHandler);
    }
}
exports.default = Router;
