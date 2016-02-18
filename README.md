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

fingerer.use(function(output) {
    output.write("I'm on the index!");
});

fingerer.use(/^([a-z \.]+)$/gi, function(output, matches) {
    output.write("I'm on path " + matches[0] + "!");
});

fingerer.listen(function(server) {
    console.log("Finger server listening on " + server.port);
}, {
  port: 79 // optional
});
```

Check out the [examples](examples/) to learn more on how to use fingerer.

## License

MIT (c) Mikael Brassman 2016
