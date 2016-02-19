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
var fingerService = fingerer();

fingerService.index(function(res) {
    res.write("I'm on the index!");
});

fingerService.use(/^([a-z \.]+)$/gi, function(res) {
    res.write("I'm on path " + res.matches[0] + "!");
});

fingerService.listen(function(server) {
    console.log("Finger server listening on " + server.port);
});
```

Check out the [examples](examples/) to learn more on how to use fingerer.

## API

### `FingerService : fingerer()`

Creates a fingerer service instance.

### `FingerService.use([{RegExp|string} queryMatcher], {function} handler)`

Installs a query router middleware.

* `queryMatcher` - Optional. Either RegExp or String. Is used by the query
router to determine if the Strings will be converted to a regular expression.

* `handler` - The middleware that will be invoked if the query matches. It takes
the following arguments `({Object} res, {function} next)`. If the handler
returns a truthy value the finger service won't close the connection
automatically when all middlewares have processed.
  * `{Object} res` - The responder object. Contains the following:
    * `{String} query` - The finger client's query
    * `{function} write(string[, encoding])` - Writes the given string to socket
    * `{function} writeLine(string[, encoding])` - Writes the given string to socket together with a newline at the end
    * `{function} flush()` - Flushes the strings to the socket and closes the connection.
    * `{Array[String]} matches` - The regular expression matches from the `queryMatcher`.
  * `{function} next` - When invoked will tell the query router to continue to the next middleware.

### `FingerService.index({function} handler)`

Convenience method to `FingerService.use(...)` with a `queryMatcher` that
matches the null query, i.e. an empty string.

### `FingerService.listen(function onStart[, {Object} options])`

Starts the finger server.

* `onStart` - The function will be called when the service has started.
* `options` - Options for the finger server. Contains the following parameters:
  * `port` - The port to listen on. Default: 79 (Port for finger, see RFC 1288).
  * `address` - The address

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

### `fingerer.disableIndex([{string} rejectMessage])`

Creates a middleware that will block other query route handlers or middlewares from
being used if the client is using a null query, i.e. empty string. Usage:

```
// takes a refusal message
var mw = fingerer.disableIndex("You can't look into the index!");
fingerServer.use(mw);
```

* `rejectMessage` - Optional message sent to the finger client when the null query was matched. Default: `"Finger online user list denied"`

## License

MIT (c) Mikael Brassman 2016
