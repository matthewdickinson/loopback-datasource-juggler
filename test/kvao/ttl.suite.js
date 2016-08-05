'use strict';

var should = require('should');
var helpers = require('./_helpers');
var Promise = require('bluebird');

module.exports = function(dataSourceFactory, connectorCapabilities) {
  describe('ttl', function() {
    var CacheItem;
    beforeEach(function unpackContext() {
      CacheItem = helpers.givenCacheItem(dataSourceFactory);
    });

    context('existing key with expire before expiration time', function() {
      it('returns ttl - Callback API', function(done) {
        CacheItem.set('a-key', 'a-value', 10, function(err) {
          if (err) return done(err);
          setTimeout(function() {
            CacheItem.ttl('a-key', function(err, ttl) {
              if (err) return done(err);
              ttl.should.be.a.Number().lessThan(10).and.greaterThanOrEqual(0);
              done();
            });
          }, 1);
        });
      });

      it('returns ttl - Promise API', function() {
        return CacheItem.set('a-key', 'a-value', 10)
          .delay(1)
          .then(function() {
            return CacheItem.ttl('a-key');
          })
          .then(function(ttl) {
            ttl.should.be.a.Number().lessThan(10).and.greaterThanOrEqual(0);
          });
      });
    });

    context('existing key with expire after expiration time', function(done) {
      it('returns -2 - Callback API', function(done) {
        CacheItem.set('a-key', 'a-value', 10, function(err) {
          if (err) return done(err);
          setTimeout(function() {
            CacheItem.ttl('a-key', function(err, ttl) {
              if (err) return done(err);
              ttl.should.equal(-2);
              done();
            });
          }, 11);
        });
      });

      it('returns -2 - Promise API', function() {
        return CacheItem.set('a-key', 'a-value', 10)
          .delay(11)
          .then(function() {
            return CacheItem.ttl('a-key');
          })
          .then(function(ttl) {
            ttl.should.equal(-2);
          });
      });
    });

    context('existing key without expire', function() {
      it('returns -1 - Callback API', function(done) {
        CacheItem.set('a-key', 'a-value', function(err) {
          if (err) return done(err);
          CacheItem.ttl('a-key', function(err, ttl) {
            if (err) return done(err);
            ttl.should.equal(-1);
            done();
          });
        });
      });

      it('returns -1 - Promise API', function() {
        return CacheItem.set('a-key', 'a-value')
          .then(function() {
            return CacheItem.ttl('a-key');
          })
          .then(function(ttl) {
            ttl.should.equal(-1);
          });
      });
    });

    context('non-existing key', function() {
      it('returns an error - Callback API', function(done) {
        CacheItem.ttl('key-does-not-exist', function(err) {
          err.message.should.match(/key-does-not-exist/);
          done();
        });
      });

      it('returns an error - Promise API', function() {
        return CacheItem.ttl('key-does-not-exist').then(
          function() { throw new Error('ttl() should have failed'); },
          function(err) { err.message.should.match(/key-does-not-exist/); });
      });
    });
  });
};
