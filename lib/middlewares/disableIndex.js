var defaultRefusalMessage = "Finger online user list denied"

var debug = require('debug')('fingerer:disableIndex');

module.exports = function(refusalMessage) {
    refusalMessage = refusalMessage || defaultRefusalMessage;
    return function (res, next) {
        debug("Enters disableIndex");
        if (/^$/.test(res.query)) {
            debug("Matches null query... Sending refusal message \"" + refusalMessage + "\"");
            res.write(refusalMessage);
        } else {
            debug("Null query is not matched... Passing through to next query route.")
            next();
        }
    };
}
