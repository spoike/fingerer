var _ = require("lodash");

var debug = require("debug")("fingerer:router");

function QueryRouter() {
    this.middlewares = [];
}

function handleArguments() {
    var regex, handler;
    if (arguments.length < 1) {
        throw new Error("Invalid arguments");
    }
    if (_.isFunction(arguments[0])) {
        regex = /^(.*)$/gi;
        handler = arguments[0];
    } else if (_.isString(arguments[0])) {
        regex = new RegExp(arguments[0]);
        handler = arguments[1];
    } else if (arguments[0] instanceof RegExp) {
        regex = arguments[0];
        handler = arguments[1];
    } else {
        throw new Error("Invalid arguments");
    }
    var params = {
        regex: regex,
        handler: handler
    };

    debug("Registering route for " + params.regex);

    return params;
}

Object.assign(QueryRouter.prototype, {
    use: function() {
        this.middlewares.push(handleArguments.apply(null, arguments));
    },
    process: function(query, writer) {
        var isAsync = false;
        for (var i = 0; i < this.middlewares.length; ++i) {
            var middleware = this.middlewares[i];
            var goNext = true;
            var matches = query.match(middleware.regex);
            if( matches ) {
                debug("Matched route with regex " + middleware.regex);
                goNext = false;
                var params = {
                    query: query,
                    write: function() {
                        writer.write.apply(writer, arguments);
                    },
                    writeLine: function() {
                        writer.writeLine.apply(writer, arguments);
                    },
                    flush: function() {
                        writer.flush();
                    },
                    matches: matches
                };
                isAsync = middleware.handler(params, function() {
                    debug("next() was called");
                    goNext = true;
                }) || isAsync;
            }
            if (!goNext) {
                debug("Exiting routes")
                break;
            }
        }
        return isAsync;
    }
});

module.exports = QueryRouter;
