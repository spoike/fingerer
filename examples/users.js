var fingerer = require("../lib");
var fingerService = fingerer();
var _ = require("lodash");

function pad (string, length) {
    length = length || 20;
    while (string.length <= length) {
        string = string + ' ';
    }
    return string
}

var users = [
    {
        username: "mmike",
        name: "Magic Mike",
        twitter: "mmike",
        plan: "Watch out for zombies!"
    },
    {
        username: "bob",
        name: "Bob the Builder",
        twitter: "bob",
        plan: "* Build a house\n* Become homeless"
    },
    {
        username: "dd",
        name: "Donald von Duck",
        twitter: "donaldduck"
    }
];

if (process.env.DISABLE_INDEX) {
    fingerService.use(fingerer.disableIndex());
}

fingerService.index(function(req) {
    req.writeLine(pad("Login") + pad("Name") + pad("Twitter"));
    _.each(users, function(user) {
        req.writeLine(pad(user.username) + pad(user.name) + pad("@" + user.twitter));
    })
});

fingerService.use(/^([a-z \.]+)$/gi, function(req) {
    var q = req.matches[0].toLowerCase();
    var found = _.find(users, function(user) {
        return user.name.toLowerCase().indexOf(q) >= 0 ||
            user.username.toLowerCase().indexOf(q) >= 0 ||
            user.twitter.toLowerCase().indexOf(q) >= 0;
    });
    if (found) {
        req.writeLine(
            pad("Login: " + found.username, 40) +
            pad("Name: " + found.name, 40) +
            pad("Twitter: @" + found.twitter, 40)
        );
        if (found.plan) {
            req.writeLine("Plan:");
            req.write(found.plan);
        }
    } else {
        req.write("Found nothing");
    }
});

fingerService.listen(function(server) {
    console.log("Finger server listening on " + server.port);
});
