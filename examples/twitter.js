// You can create twitter apps and get credentials here:
// https://apps.twitter.com/
var twitterApiKey = encodeURIComponent(process.env.TWITTER_API_KEY);
var twitterApiSecret = encodeURIComponent(process.env.TWITTER_API_SECRET);
var bearerTokenCredentials = new Buffer(twitterApiKey + ":" + twitterApiSecret).toString("base64");

require('es6-promise').polyfill();
require('isomorphic-fetch');

var fingerer = require("../lib");
var fingerService = fingerer();
var _ = require("lodash");
var debug = require("debug")("twitter:app");
var error = require("debug")("twitter:error");

function pad (string, length) {
    length = length || 20;
    while (string.length <= length) {
        string = string + ' ';
    }
    return string
}

function getAccessToken() {
    debug("fetching accesstoken");
    return fetch("//api.twitter.com/oauth2/token", {
        method: "POST",
        headers: {
            Host: "api.twitter.com",
            "User-Agent": "Spoike's Test App",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            Authorization: "Basic " + bearerTokenCredentials
        },
        body: "grant_type=client_credentials"
    }).then(function (body) {
        return body.json();
    }).then(function (data) {
        var token = data["access_token"];
        if (!token) {
            throw new Error(JSON.stringify(data, null, 2));
        }
        return token;
    });
}
var getCachedAccessToken = getAccessToken();

function getTweets(accessToken, search) {
    debug("Getting tweets for " + search);
    return fetch("//api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + encodeURIComponent(search), {
            headers: {
                Host: "api.twitter.com",
                "User-Agent": "Spoike's Test App",
                Authorization: "Bearer " + accessToken
            }
        })
        .then(function (body) {
            return body.json();
        });
}

var users = ["spoike"];

fingerService.use(fingerer.disableIndex());

fingerService.use(/([a-z\. ]+)/gi, function(res) {
    var username = res.matches[0].toLowerCase();
    return getCachedAccessToken
            .then(function(token) {
                debug("got access token " + token);
                return getTweets(token, username);
            })
            .then(function(tweets) {
                if (tweets.length > 0) {
                    res.writeLine('Tweets:' + '\r\n');
                    _.each(tweets, function(tweet) {
                        res.writeLine(pad("@"+tweet.user.name) + ": " + tweet.text);
                    });
                }
                res.flush();
            })
            .catch(function(err) {
                error(err);
                res.writeLine("Could not get tweets for \"" + username + "\"")
                res.flush();
            });
});

fingerService.listen(function(server) {
    console.log("Twitter finger proxy server listening on " + server.port);
});
