/**
 * Created by javieranselmi on 1/11/17.
 */
var knex = require('../../config/knex');

function getToken(tokenKey, clientId) {
    return knex.select('token').from('tokens').where('clientId','=', clientId).where('tokenLabel','=',tokenKey)
        .then(function(res) {
        if (res.length < 1) {
            throw Error('Client ID not found')
        }
        return res[0].token;
    });
}

//TODO: implement setToken function
//TODO: relate token to a user/site

var tokenManager = {
    getToken: getToken
}

module.exports = tokenManager;
