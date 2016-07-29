'use strict';

var assert = require('assert');
var Connector = require('loopback-connector').Connector;
var debug = require('debug')('loopback:connector:kv-memory');
var util = require('util');

exports.initialize = function initializeDataSource(dataSource, cb) {
  var settings = dataSource.settings;
  dataSource.connector = new KeyValueMemoryConnector(settings, dataSource);
  if (cb) process.nextTick(cb);
};

function KeyValueMemoryConnector(settings, dataSource) {
  Connector.call(this, 'kv-memory', settings);

  debug('Connector settings', settings);

  this.dataSource = dataSource;
  this.DataAccessObject = dataSource.juggler.KeyValueAccessObject;

  this._store = Object.create(null);
};
util.inherits(KeyValueMemoryConnector, Connector);

KeyValueMemoryConnector.prototype._getStoreForModel = function(modelName) {
  if (!(modelName in this._store)) {
    this._store[modelName] = Object.create(null);
  }
  return this._store[modelName];
};

KeyValueMemoryConnector.prototype.get = function(modelName, key, callback) {
  var store = this._getStoreForModel(modelName);
  var value = store[key];
  // TODO - handle key not found

  debug('GET %j %j -> %s', modelName, key, value);

  if (/^buffer:/.test(value)) {
    value = new Buffer(value.slice(7), 'base64');
  } else {
    value = JSON.parse(value);
  }

  process.nextTick(function() {
    callback(null, value);
  });
};

KeyValueMemoryConnector.prototype.set = function(modelName, key, value, callback) {
  var store = this._getStoreForModel(modelName);
  var value;
  if (Buffer.isBuffer(value)) {
    value = 'buffer:' + value.toString('base64');
  } else {
    value = JSON.stringify(value);
  }
  debug('SET %j %j %s', modelName, key, value);
  store[key] = value;
  process.nextTick(function() { callback(); });
};
