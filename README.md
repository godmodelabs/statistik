statistik
=========

__statistik__ is a Node.js client for Etsy's StatsD with cli support.

It implements StatsD's protocol 1:1 and doesn't provide additional features.
The UDP connection is closed if not used for a second in order to minimize StatsD's open connections.

Usage
-----

In node.js:

```bash
$ npm install statistik
```

```javascript
var log = require('statistik')('localhost:8125');

log.timing('pageload', 123);        // in miliseconds
log.timing('pageload', 123, 0.5);   // supports sampling

log.increment('visits');
log.increment(['users', 'wins']);   // handles multiple stats at once
log.decrement('users', 0.2);        // supports sampling as well

log.gauge('cpu-usage', 30, 0.2);    // gauges with sampling work too
```

In CLI:

```bash
$ npm install -g statistik
$ statistik --help
  
    Usage: statistik [options] arguments

    Options:

      -h, --help         output usage information
      -V, --version      output the version number
      -h, --host <host>  StatsD hostname

    Configuration:

      $ echo "graphite.local:8125" > ~/.statistik

    Examples:

      $ statistik increment visits
      $ statistik timing load 30 0.5
      $ statistik -h graphite.local:8125 gauge mem-usage 12

```

API
---

If you specify a sampleRate (between 0 and 1) StatsD doesn't get hit on every
log event in order to reduce load but samples up the events that get through so the stats stay correct.

The parameter `stat` can always be either a `string` or an `array`, in case you want to log the same data to different _stats_.

### statistik([host='localhost'][, port=8125])
Returns an instance of __statistik__ bound to `host:port`, from now on referred to as `log`.

Both parameters can also be set at once: `statistik('localhost:8125')`.

### log.timing(stat, time[, sampleRate])
Log `time` in milliseconds to `stat`.

### log.increment(stat[, sampleRate])
Increment the counter at `stat` by 1.

### log.decrement(stat[, sampleRate])
Decrement the counter at `stat` by 1.

### log.gauge(stat, value[, sampleRate])
Set the gauge at `stat` to `value`.

### log.send(stat, value, method [, sampleRate])
Transmit data to StatsD following StatsD's UDP protocol: `<stat>:<value>|<method>@<sampleRate>`.
  
You might need to use this if you have a non standard StatsD implementation running and want to log custom data.

### log.stop()
Close the UDP socket. This might be necessary if your script doesn't immediately terminate when all work is done just because the UDP socket is still open.

Running the tests
-----------------

```bash
$ node tests.js

    all tests passed after 9ms
    
```

ToDo
----

* Improve tests

License
-------
(MIT)

Copyright (c) 2012 Julian Gruber <julian@juliangruber.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.