'use strict';

var utils = require('../utils');

/**
 * Set the value for the given key.
 *
 * @param {String} key
 * @param {*} value
 * @callback cb
 * @param {Error} error
 *
 * @header KVAO.set(key, value, cb)
 */
module.exports = function keyValueSet(key, value, callback) {
  callback = callback || utils.createPromiseCallback();
  // TODO convert possible model isntance in "value" to raw data via toObect()
  this.getConnector().set(this.modelName, key, value, callback);
  return callback.promise;
};

