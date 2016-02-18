var _ = require("lodash");

function QueryRouter() {
    this.middlewares = [];
}

function handleArguments() {
    var regex, handler;
    if (arguments.length < 1) {
        throw new Error("Invalid arguments");
    }
    if (_.isFunction(arguments[0])) {
        regex = /^$/gi;
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
    return {
        regex: regex,
        handler: handler
    };
}

Object.assign(QueryRouter.prototype, {
    use: function() {
        this.middlewares.push(handleArguments.apply(null, arguments));
    },
    process: function(query, writer) {
        for (var i = 0; i < this.middlewares.length; ++i) {
            var middleware = this.middlewares[i];
            var goNext = true;
            if( query.match(middleware.regex) ) {
                goNext = false;
                middleware.handler({
                    query: query,
                    write: function() {
                        writer.write.apply(writer, arguments);
                    }
                }, function() {
                    goNext = true;
                });
            }
            if (!goNext) {
                break;
            }
        }
    }
});

module.exports = QueryRouter;
