"use strict";
module.exports =
    ({ logger }) => (req, _, next) => {
        logger.info(`${req.method} - ${req.path}`);
        next();
    };
