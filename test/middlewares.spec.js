var test = require('tape');
var QueryRouter = require('../lib/QueryRouter');
var disableIndex = require('../lib/middlewares/disableIndex');

test('using disableIndex middleware and using null query (index)', function(t) {
    var qr = new QueryRouter();
    var rejectMsg = "sample rejection message";
    t.plan(1);

    qr.use(disableIndex(rejectMsg));

    qr.use(() => {
        t.fail("Shouldn't call any subsequent handler");
    });

    qr.process("", {
        write: function(msg) {
            t.equal(msg, rejectMsg);
        }
    });
});

test('using disableIndex middleware and using other query', function(t) {
    var qr = new QueryRouter();
    var rejectMsg = "sample rejection message";
    var query = "dude";
    var responseMsg = "Dude!";
    t.plan(3);

    qr.use(disableIndex(rejectMsg));

    qr.use((res) => {
        t.equal(res.query, "dude");
        res.write(responseMsg);
    });

    qr.process(query, {
        write: function(msg) {
            t.equal(msg, responseMsg);
        }
    });

    qr.process("", {
        write: function(msg) {
            t.equal(msg, rejectMsg);
        }
    });

});
