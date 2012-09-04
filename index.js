var dgram = require('dgram');

var StatsD = function(host) {
  this.host = host || 'localhost';
}

StatsD.prototype.timing = function(stat, time, sampleRate) {
  this.send(stat, time, 'ms', sampleRate);
}

StatsD.prototype.increment = function(stat, sampleRate) {
  this.send(stat, 1, 'c', sampleRate);
}

StatsD.prototype.decrement = function(stat, sampleRate) {
  this.send(stat, -1, 'c', sampleRate);
}

StatsD.prototype.gauge = function(stat, value, sampleRate) {
  this.send(stat, value, 'g', sampleRate);
}

StatsD.prototype.send = function(stats, value, method, sampleRate) {
  if (sampleRate && Math.random() > sampleRate) return;
  if ('string' == typeof stats) stats = [stats];
  this.lastTransmissionAt = Date.now();
  
  var message;
  for (var s in stats) {
    message = stats[s]+':'+value+'|'+method;
    if (sampleRate) message += '@'+sampleRate;

    if (!this.socket) this.socket = dgram.createSocket('udp4');
    this.socket.send(new Buffer(message), 0, message.length, 8125, this.host);
    this.clearSocket();
  }
}

StatsD.prototype.close = function() {
  setTimeout(bind(this, function() {
    if (!this.socket) return;
    this.socket.close();
    this.socket = null;
    clearTimeout(this.timeout);
  }), 10);
}

StatsD.prototype.clearSocket = function() {
  clearTimeout(this.timeout);
  this.timeout = setTimeout(bind(this, function() {
    if (!this.socket) return;
    if (Date.now()-this.lastTransmissionAt < 1000) return this.clearSocket();
    this.close();
  }), 1000);
}

function bind(obj, fn) {
  return function() {
    return fn.call(obj);
  }
}

module.exports = function(host) {
  return new StatsD(host);
};