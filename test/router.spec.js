var test = require('tape');
var QueryRouter = require('../lib/QueryRouter');

test('adding simple index middleware', function(t) {
    var qr = new QueryRouter();
    var query = "";
    t.plan(2);

    qr.use(function(req) {
        t.ok(req,
            "Should call the index router");
        t.equal(query, req.query,
            "Should contain the query that triggered it");
    });

    qr.use(/^[a-z]+$/gi, function() {
        t.fail("Should not call the other route");
    })

    qr.process(query);
});


test('adding a simple handler', function(t) {
    var qr = new QueryRouter();
    var query = "dude";
    t.plan(2);

    qr.use(function() {
        t.fail("Should not call the index route");
    });

    qr.use(/^[a-z]+$/gi, function(req) {
        t.ok(req,
            "Should call the simple handler");
        t.equal(query, req.query,
            "Should contain the query that triggered it");
    })

    qr.process(query);
});

test('using next in a handler', function(t) {
    var qr = new QueryRouter();
    var query = "dude";
    t.plan(4);

    qr.use("dude", function(req, next) {
        t.ok(req,
            "Should call the simple handler");
        t.equal(query, req.query,
            "Should contain the query that triggered it");
        next();
    });

    qr.use(/^[a-z]+$/gi, function(req) {
        t.ok(req,
            "Should call the simple handler");
        t.equal(query, req.query,
            "Should contain the query that triggered it");
    })

    qr.process(query);

});

test('not using next in a handler', function(t) {
    var qr = new QueryRouter();
    var query = "dude";
    t.plan(2);

    qr.use("dude", function(req) {
        t.ok(req,
            "Should call the simple handler");
        t.equal(query, req.query,
            "Should contain the query that triggered it");
    });

    qr.use(/^[a-z]+$/gi, function(req) {
        t.fail("Shouldn't go in here");
    })

    qr.process(query);

});
