'use strict';

var elasticsearch = require('elasticsearch');

const Adapter = require('./src/Adapter');
const Client = require('./src/Client');
const Presentor = require('./src/Presentor');
const ClientCacheDecorator = require('./src/ClientCacheDecorator');

module.exports.Adapter = Adapter
module.exports.Client = Client
module.exports.Presentor = Presentor
module.exports.ClientCacheDecorator = ClientCacheDecorator
