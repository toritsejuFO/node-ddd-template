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
const { StatusCodes: { FORBIDDEN } } = require('http-status-codes');
module.exports =
    ({ jwtService, repository: { userRepository } }) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.get('X-Auth-Token');
        let email, userId;
        if (!token) {
            return res
                .status(FORBIDDEN)
                .send({ success: false, message: 'X-Auth-Token header is required' });
        }
        try {
            const decodedPayload = jwtService.verify(token);
            ({ email, userId } = decodedPayload);
        }
        catch (error) {
            return res.status(FORBIDDEN).send({
                success: false,
                message: 'Could not validate X-Auth-Token',
                error: error.message
            });
        }
        const user = yield userRepository.findOneBy({ email, userId });
        req.user = user;
        next();
    });
