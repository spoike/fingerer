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
var fingerServer = fingerer();

fingerServer.use(function(res) {
    res.write("I'm on the index!");
});

fingerServer.use(/^([a-z \.]+)$/gi, function(res) {
    res.write("I'm on path " + res.matches[0] + "!");
});

fingerServer.listen(function(server) {
    console.log("Finger server listening on " + server.port);
}, {
  port: 79 // optional
});
```

Check out the [examples](examples/) to learn more on how to use fingerer.

## Middlewares

Much like middleware in e.g. Express app, a middleware is a function that takes
a responder/parameters object and a `next` function. Calling the next function
will tell fingerer to continue to the next middleware.

```
function myMiddleware(res, next) {
  res.write("Passing through!")
  next();
}

fingerServer.use(myMiddleware);
```

Other than that the following middlewares are also available:

### disableIndex

This middleware will block other query route handlers or middlewares from
being used if the client is using a null query, i.e. "\r\n".

```
// takes a refusal message
var mw = fingerer.disableIndex("You can't look into the index!");
fingerServer.use(mw);
```

## License

MIT (c) Mikael Brassman 2016
