/*
*   abhishek goswami (hiro)
*   abhishekg785@gmail.com
*
*   session-service.js  file for handling user sessions
*/

var config = require('../config');

var redisClient = null;
var redisStore = null;

var self = module.exports = {
    initializeRedis: function (client, store) {
        redisClient = client;
        redisStore = store;
    },

    getSessionId: function (handshake) {
        return handshake[config.sessionCookieKey];
    },

    get: function (handshake, callback) {
      console.log('IN THE GET FUNCTION');
        var sessionId = self.getSessionId(handshake);
        self.getSessionBySessionID(sessionId, function (err, session) {
            if (err) callback(err);
            if (callback != undefined)
                callback(null, session);
        });
    },

    getSessionBySessionID: function (sessionId, callback) {
        redisStore.load(sessionId, function (err, session) {
            if (err) callback(err);
            if (callback != undefined)
                callback(null, session);
        });
    },

    getUserName: function (handshake, callback) {
        self.get(handshake, function (err, session) {
            if (err) callback(err);
            if (session)
                callback(null, session.username);
            else
                callback(null);
        });
    }
};
