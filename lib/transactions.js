var request = require('request');
var xml2js = require('xml2js');

var self = require('./abstract');
self.prototype.init = function() {
    switch (this.mode) {
        case self.MODE_PAYMENT:
            this.uri = "https://ws.pagseguro.uol.com.br/v2/transactions";
            break;

        case self.MODE_SANDBOX:
            this.uri = "https://ws.sandbox.pagseguro.uol.com.br/v2/transactions";
            break;
    }
};
    
/**
 * Retrieve transaction details
 * @param {String} code
 */
self.prototype.details = function(code) {
    var this1 = this;

    var options = {
        method: 'GET',
        uri: this.uri + "/" + code + "?email=" + this.email + "&token=" + this.token
    };

    this.log(options.uri);

    request(options, function(error, response, body) {
        if (error) {
            this1.catchCallback(error.message, null);
            return
        }

        if (response.statusCode == 200) {
            xml2js.parseString(body, function(error, xml) {
                if (error) {
                    this1.catchCallback(error);
                    return;
                }

                for (var k in xml.transaction) {
                    if (xml.transaction.hasOwnProperty(k)) {
                        var property = xml.transaction[k];
                        if (typeof property[0] !== 'object')
                            xml.transaction[k] = property[0];
                    }
                }

                this1.thenCallback(xml);
            });
        } else {
            this1.catchCallback(body);
        }
    });
    return this;
};

/**
 * Find transactions
 */
self.prototype.find = function() {
    this.log('Finding transactions');
};

/**
 * Retrieve transaction details from notification code
 * @param {String} code
 * @returns {self}
 */
self.prototype.notification = function(code) {
    var this1 = this;

    var options = {
        method: 'GET',
        uri: this.uri + "/notifications/" + code + "?email=" + this.email + "&token=" + this.token
    };

    this.log(options.uri);

    request(options, function(error, response, body) {
        if (error) {
            this1.catchCallback(error.message, null);
            return
        }

        if (response.statusCode == 200) {
            xml2js.parseString(body, function(error, xml) {
                if (error) {
                    this1.catchCallback(error);
                    return;
                }

                for (var k in xml.transaction) {
                    if (xml.transaction.hasOwnProperty(k)) {
                        var property = xml.transaction[k];
                        if (typeof property[0] !== 'object')
                            xml.transaction[k] = property[0];
                    }
                }

                this1.thenCallback(xml);
            });
        } else {
            this1.catchCallback(body);
        }
    });
    return this;
};

module.exports = self;