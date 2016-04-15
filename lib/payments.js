var request = require('request');

var self = require('./abstract');
self.prototype.init = function() {
    switch (this.mode) {
        case self.MODE_PAYMENT:
            this.uri = "https://ws.pagseguro.uol.com.br/v2/checkout";
            break;

        case self.MODE_SANDBOX:
            this.uri = "https://ws.sandbox.pagseguro.uol.com.br/v2/checkout";
            break;
    }
};

/**
 * Add an item to payment
 * @param {Object} item
 */
self.prototype.addItem = function(item) {
    this.log('Item added');
};

/**
 * Send data to API
 */
self.prototype.send = function() {
    this.log('Sending request...');
};

module.exports = self;