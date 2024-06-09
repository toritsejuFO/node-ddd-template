"use strict";
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const MODELS_PATH = path.resolve(__dirname, 'models');
module.exports.load = (config) => {
    const sequelize = new Sequelize(config.db.url, config.db.options);
    const db = {};
    fs.readdirSync(MODELS_PATH).forEach((file) => {
        const modelPath = path.resolve(MODELS_PATH, file);
        const model = require(modelPath)(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });
    Object.keys(db).forEach((model) => {
        if (model.associate) {
            model.associate(db);
        }
    });
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
};
