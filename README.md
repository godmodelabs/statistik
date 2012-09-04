statistik
=========

__statistik__ is a Node.js client for Etsy's StatsD with cli support

Usage
-----

In node.js:

```bash
$ npm install statistik
```

```javascript
var log = require('statistik')('localhost');

log.timing('pageload', 123);        // in miliseconds
log.timing('pageload', 123, 0.5);   // supports sampling

log.increment('visits');
log.increment(['users', 'wins']);   // handles multiple stats at once
log.decrement('users', 0.2);        // supports sampling as well

log.gauge('cpu-usage', 30, 0.2);    // gauges with sampling work too
```

In CLI:

```bash
$ npm isntall -g statistik
$ statistik --help
  
    Usage: statistik [options] arguments

    Options:

      -h, --help         output usage information
      -V, --version      output the version number
      -h, --host <host>  StatsD hostname

    Configuration:

      $ echo "graphite.local" > ~/.statistik

    Examples:

      $ statistik increment visits
      $ statistik timing load 30 0.5
      $ statistik -h graphite.local gauge mem-usage 12

```

Running the tests
-----------------

```bash
$ node tests.js

    all tests passed after 9ms
    
```

License
-------
(MIT)

Copyright (c) 2012 Julian Gruber <julian@juliangruber.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.