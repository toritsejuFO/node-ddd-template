"use strict";
const { StatusCodes } = require('http-status-codes');
module.exports =
    ({ logger }) => (req, res) => {
        const message = `Invalid Route, cannot ${req.method} ${req.path}`;
        logger.info('INVALID_ROUTE:', message);
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message });
    };
