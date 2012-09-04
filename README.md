node-statsd-client
==================

Node.js client for Etsy's StatsD

Usage
-----

```bash
npm install node-statsd-client
```

```javascript
var log = require('node-statsd-client')('localhost');

log.timing('pageload', 123);        // in miliseconds
log.timing('pageload', 123, 0.5);   // supports sampling

log.increment('visits');
log.increment(['users', 'wins']);   // handles multiple stats at once
log.decrement('users', 0.2);        // supports sampling as well

log.gauge('cpu-usage', 30, 0.2);    // gauges with sampling work too
```