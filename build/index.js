"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = __importDefault(require("./onboarding/container"));
const app = container_1.default.resolve('app');
app
    .start()
    .then(() => {
    app.logger.info(':::APP STARTED:::');
})
    .catch((error) => {
    app.logger.error(error);
    app.logger.error(':::APP FAILED TO START:::');
    process.exit(1);
});
