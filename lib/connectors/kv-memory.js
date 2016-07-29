'use strict';

var assert = require('assert');
var Connector = require('loopback-connector').Connector;
var debug = require('debug')('loopback:connector:kv-memory');
var util = require('util');

exports.initialize = initializeDataSource(dataSource, cb) {
  var settings = dataSource.settings;

  process.nextTick(function() {
    cb && cb();
  });
};

function KeyValueMemoryConnector(settings, dataSource) {
  Connector.call(this, 'kv-memory', settings);
  this.dataSource = dataSource;

  debug('Connector settings', settings);

  this.DataAccessObject = function() {
    // FIXME use KV DAO from juggler instead
  };
};
util.inherits(KeyValueMemoryConnector, Connector);

KeyValueMemoryConnector.prototype.execute = function(command, args, cb) {
  if (cb === undefined && typeof args === 'function') {
    cb = args;
    args = [];
  }

  assert(typeof command === 'string', 'command must be a string');
  assert(typeof cb === 'function', 'command must be a function');

  debug('EXECUTE %j %j', command, args);
};

KeyValueMemoryConnector.prototype.get = function(cb) {
};

KeyValueMemoryConnector.prototype.set = function(cb) {
};

KeyValueMemoryConnector.prototype.ping = function(cb) {
};


