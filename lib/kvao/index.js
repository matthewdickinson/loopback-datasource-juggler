'use strict';

function KeyValueAccessObject() {
};

module.exports = KeyValueAccessObject;

KeyValueAccessObject.get = require('./get');
KeyValueAccessObject.set = require('./set');

KeyValueAccessObject.getConnector = function() {
  return this.getDataSource().connector;
};

