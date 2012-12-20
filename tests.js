/**
 * Testsuite for the node statsd client
 *
 * TODO: test constructor
 */

// Module dependencies
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var log = require('./index.js')();
var assert = require('assert');
var check = function() { throw 'fail'; /* replaced with test function */ };

// Tests
var tests = [{
    name: 'timing', fn: 'timing', args: ['pageload', 123],
    res: 'pageload:123|ms'
  }, {
    name: 'timingSampled', fn: 'timing', args: ['pageload', 123, 0.999],
    res: 'pageload:123|ms|@0.999'
  }, {
    name: 'increment', fn: 'increment', args: ['visits'],
    res: 'visits:1|c'
  }, {
    name: 'incrementMulti', fn: 'increment', args: [['users', 'wins']],
    res: ['users:1|c', 'wins:1|c']
  }, {
    name: 'decrement', fn: 'decrement', args: ['users'],
    res: 'users:-1|c'
  }, {
    name: 'decrementSampled', fn: 'decrement', args: ['users', 0.999],
    res: 'users:-1|c|@0.999'
  }, {
    name: 'gauge', fn: 'gauge', args: ['usage', 30, 0.999],
    res: 'usage:30|g|@0.999'
  }
];

// Emulate StatsD server and run tests when a message comes in
server.bind(8125);
server.on('message', function(msg) { check(msg.toString()); });
 
//----------------------------------------------------------------------------

// Testign utilities
function bind(obj, fn) { return function() { fn.call(obj); } }
function Queue() { this.toexec = []; }
Queue.prototype.add = function(fn) { this.toexec.push(fn); };
Queue.prototype.run = function() {
  this.start = Date.now();
  this.toexec[0](bind(this, cb));
  function cb() {
    this.toexec = this.toexec.slice(1);
    if (this.toexec.length > 0) return this.toexec[0](bind(this, cb));
    console.log('')
    console.log('  all tests passed after '+(Date.now()-this.start)+'ms');
    console.log('')
  }
}

var q = new Queue();

// enqueue all tests
var test, res;
for (t in tests) {
  test = tests[t];
  q.add((function(test) {
    return function(done) {
      log[test.fn].apply(log, test.args);
      check = function(msg) {
        res = typeof test.res == 'string'? test.res : test.res[0];
        assert(msg == res, test.name);
        if (typeof test.res == 'string' || test.res.length == 1) return done(); 
        // supports only 1 or 2 arguments in res. should be enough
        check = function(msg) {
          assert(msg == test.res[1], test.name);
          done();
        }
      }
    }
  })(test));
}

q.add(function finishUp(done) {
  server.close();
  log.increment('should not fail');
  log.close();
  done();
});

// Start Tests
q.run();

// Constructor
var constructor = require('./index')
assert.equal(constructor('foo:1234').host, 'foo')
assert.equal(constructor('foo:1234').port, '1234')
