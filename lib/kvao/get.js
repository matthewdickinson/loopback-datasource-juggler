'use strict';

var utils = require('../utils');

/**
 * Get the value stored for the given key.
 *
 * @param {String} key
 * @callback cb
 * @param {Error} error
 * @param {*} value
 *
 * @header KVAO.get(key, cb)
 */
module.exports = function keyValueGet(key, callback) {
  callback = callback || utils.createPromiseCallback();
  var options = {};
  this.getConnector().get(this.modelName, key, options, function(err, result) {
    // TODO convert raw result to Model instance (?)
    callback(err, result);
  });
  return callback.promise;
};
