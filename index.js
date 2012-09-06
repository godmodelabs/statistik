var dgram = require('dgram');

/**
 * Returns an instance of statistik bound to `host`.
 * 
 * @constructor
 * @param {string} [host='localhost'] StatsD's hostname 
 */
var Statistik = function(host, port) {
  if (host && host.search(':')>-1) {
    host = host.split(':')[0];
    port = host.split(':')[1];
  }
  this.host = host || 'localhost';
  this.port = port || 8125;
}

/**
 * Log `time` in milliseconds to `stat`.
 * 
 * @param {string|string[]} stat
 * @param {integer}         time
 * @param {float}           [sampleRate]
 */
Statistik.prototype.timing = function(stat, time, sampleRate) {
  this.send(stat, time, 'ms', sampleRate);
}

/**
 * Increment the counter at `stat` by 1.
 * 
 * @param {string|string[]} stat
 * @param {float}           [sampleRate]
 */
Statistik.prototype.increment = function(stat, sampleRate) {
  this.send(stat, 1, 'c', sampleRate);
}

/**
 * Decrement the counter at `stat` by 1.
 * 
 * @param {string|string[]} stat
 * @param {float}           [sampleRate]
 */
Statistik.prototype.decrement = function(stat, sampleRate) {
  this.send(stat, -1, 'c', sampleRate);
}

/**
 * Set the gauge at `stat` to `value`.
 * 
 * @param {string|string[]} stat
 * @param {integer}         value
 * @param {float}           [sampleRate]
 */
Statistik.prototype.gauge = function(stat, value, sampleRate) {
  this.send(stat, value, 'g', sampleRate);
}

/**
 * Transmit data to StatsD following StatsD's UDP protocol:
 * 
 * `<stat>:<value>|<method>@<sampleRate>`
 * 
 * You might need to use this if you have a non standard StatsD implementation
 * running and want to log custom data.
 * 
 * @param {string|string[]} stats
 * @param {integer}         value
 * @param {string}          method
 * @param {float}           [sampleRate]
 */
Statistik.prototype.send = function(stats, value, method, sampleRate) {
  if (sampleRate && Math.random() > sampleRate) return;
  if ('string' == typeof stats) stats = [stats];
  this.lastTransmissionAt = Date.now();
  
  var message;
  for (var s in stats) {
    message = stats[s]+':'+value+'|'+method;
    if (sampleRate) message += '@'+sampleRate;

    if (!this.socket) this.socket = createSocket();
    this.socket.send(new Buffer(message), 0, message.length, this.port, this.host);
    this.clearSocket();
  }
}

/**
 * Close the UDP socket.
 * 
 * This might be necessary if your script doesn't immediately terminate when
 * all work is done just because the UDP socket is still open.
 * 
 * Also used internally by `clearSocket()` to close the socket after it has
 * been idle for 1s.
 */
Statistik.prototype.close = function() {
  setTimeout(bind(this, function() {
    if (!this.socket) return;
    this.socket.close();
    this.socket = null;
    clearTimeout(this.timeout);
  }), 10);
}

/**
 * Calls `close()` if the socket has been idle for 1s.
 * Shouldn't need to be called manually.
 * 
 * @private
 */
Statistik.prototype.clearSocket = function() {
  clearTimeout(this.timeout);
  this.timeout = setTimeout(bind(this, function() {
    if (!this.socket) return;
    if (Date.now()-this.lastTransmissionAt < 1000) return this.clearSocket();
    this.close();
  }), 1000);
}

/**
 * Returns a new socket and silences it's errors.
 * 
 * @private
 * @returns {object} socket
 */
function createSocket() {
  var socket = dgram.createSocket('udp4');
  socket.on('error', function() {/*noop*/});
  return socket;
}

/**
 * Bind utility.
 * 
 * @param   {object}    obj Object to bind to
 * @param   {function}  fn  Function to bind
 * @returns {function}      Bound function
 */
function bind(obj, fn) {
  return function() {
    return fn.call(obj);
  }
}

module.exports = function(host) {
  return new Statistik(host);
};