"use strict";
const sequelize = require('../sequelize');
module.exports = ({ config, logger }) => {
    if (config.db) {
        return sequelize.load(config);
    }
    logger.error('DB_ERROR, missing config. Exiting.');
    process.exit(1);
};
