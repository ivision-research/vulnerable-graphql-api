'use strict';

import fs from 'fs';
import path from 'path';
import {Sequelize, Op} from 'sequelize';
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = JSON.parse(fs.readFileSync(__dirname + '/../../config/config.json').toString())[env];
export const db: any = {};

const operatorsAliases = {
  'and': Op.and,
  'or': Op.or,
  'gt': Op.gt,
  'gte': Op.gte,
  'lt': Op.lt,
  'lte': Op.lte,
  'ne': Op.ne,
  'eq': Op.eq
}

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, {operatorsAliases, ...config});
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {operatorsAliases, ...config});
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;