'use strict';

var should = require('should');
var helpers = require('./_helpers');

module.exports = function(dataSourceFactory, connectorCapabilities) {
  describe('get/set', function() {
    var CacheItem;
    beforeEach(function unpackContext() {
      CacheItem = helpers.givenCacheItem(dataSourceFactory);
    });

    it('works for string values', function(done) {
      CacheItem.set('a-key', 'a-value', function(err) {
        if (err) return done(err);
        CacheItem.get('a-key', function(err, value) {
          if (err) return done(err);
          value.should.equal('a-value');
          done();
        });
      });
    });

    it('works for string values - Promise API', function() {
      return CacheItem.set('a-key', 'a-value')
        .then(function() { return CacheItem.get('a-key'); })
        .then(function(value) { value.should.equal('a-value'); });
    });

    it('works for Object values', function() {
      return CacheItem.set('a-key', { a: 1, b: 2 })
        .then(function() { return CacheItem.get('a-key'); })
        .then(function(value) { value.should.eql({ a: 1, b: 2 }); });
    });

    it('works for Buffer values', function() {
      return CacheItem.set('a-key', new Buffer([1, 2, 3]))
        .then(function() { return CacheItem.get('a-key'); })
        .then(function(value) { value.should.eql(new Buffer([1, 2, 3])); });
    });
  });
};
