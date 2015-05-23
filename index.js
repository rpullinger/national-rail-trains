var soap = require('soap'),
    async = require('async');

var nationalrail = (function(){

    var url = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/wsdl.aspx',
        token;

    function setToken(userToken){ token = userToken; }

    function getBoard(type, params, callback){

        async.waterfall([
            function(callback){
                soap.createClient(url, callback)
            },
            function(client, callback){

                client.addSoapHeader({
                    AccessToken: {
                        TokenValue: token
                    }
                });

                switch(type) {
                    case 'departure':
                        client.GetDepartureBoard(params, callback);
                        break;
                    case 'arrival':
                        client.GetArrivalBoard(params, callback);
                        break;
                    case 'both':
                        client.GetArrivalDepartureBoard(params, callback);
                        break;
                }
            }
        ], function(err, results) {
            if (typeof callback === 'function') {
                callback(err, results);
            }
        });
    }

    return {
        setToken: setToken,
        getDepartures: function(params, callback) { getBoard('departure', params, callback); },
        getArrivals: function(params, callback) { getBoard('arrival', params, callback); },
        getArrivalsAndDepartures: function(params, callback) { getBoard('both', params, callback); }
    }

})();

module.exports = nationalrail;