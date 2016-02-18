# fingerer

The Super Simple [Finger Protocol (RFC 1288)](http://tools.ietf.org/html/rfc1288)
Application Framework

## Installation

`npm install --save fingerer`

## Usage

Below is some sample code that will get you going:

```javascript
// index.js
var fingerer = require("fingerer");

fingerer.index(function(output) {
    output.write("I'm on the index!");
});

fingerer.path(/^([a-z \.]+)$/gi, function(output, matches) {
    console.log(arguments);
    output.write("I'm on path " + matches[0] + "!");
});

fingerer.listen(function(server) {
    console.log("Finger server listening on " + server.port);
});
```

Note that since the finger protocol uses a restricted port (79) on most
environments you will need to use administrative priviledges in order to start
your finger server.

```
$ sudo node index.js
Finger server listening on 79
```

In the sample code above you'll get the following responses:

```
$ finger @127.0.0.1
[127.0.0.1]
I'm on the index!

$ finger dude@127.0.0.1
[127.0.0.1]
I'm on path dude!
```

## License

MIT (c) Mikael Brassman 2016
