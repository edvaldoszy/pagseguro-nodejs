var request = require('request');
var foreach = require('./foreach');
var Node = require('./xml-node');

/* Construção da classe */
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

    this.xml = {
        checkout: null,
        item: null
    };

    this.xml.checkout = new Node('checkout', []);
    this.xml.items = new Node('items', []);
    this.xml.checkout.add(this.xml.items);
};

self.prototype.currency = function(str) {

    this.xml.checkout.add(new Node('currency', str));
    return this;
};

self.prototype.reference = function(str) {

    this.xml.checkout.add(new Node('reference', str));
    return this;
};

self.prototype.addItem = function(params) {

    var item = new Node('item', []);
    foreach(params, function(v, k) {
        item.add(new Node(k, v));
    });
    this.xml.items.add(item);
    return this;
};

self.prototype.sender = function(params) {

    var sender = new Node('sender', []);
    foreach(params, function(v, k) {

        if (k == 'phone' && typeof(v) == 'object') {
            var phone = new Node('phone', []);
            foreach(v, function(v1, k1) {
                phone.add(new Node(k1, v1));
            });
            sender.add(phone);
        } else {
            sender.add(new Node(k, v));
        }
    });

    this.xml.checkout.add(sender);
    return this;
};

self.prototype.shipping = function(params) {

    var shipping = new Node('shipping', []);
    foreach(params, function(v, k) {

        if (k == 'address' && typeof(v) == 'object') {
            var address = new Node('address', []);
            foreach(v, function(v1, k1) {
                address.add(new Node(k1, v1));
            });
            shipping.add(address);
        } else {
            shipping.add(new Node(k, v));
        }
    });

    this.xml.checkout.add(shipping);
    return this;
};

self.prototype.checkout = function(callback) {
    var self = this;

    var uri = this.uri + "?email=" + this.email + "&token=" + this.token;
    this.log(uri);

    request({
        method: 'POST',
        uri: uri,
        headers: {
            'Content-Type': 'application/xml; charset=ISO-8859-1'
        },
        body: this.xml.checkout.toString()

    }, function(error, response, body) {

        if (error) {
            callback(false, error.message);
            self.log('Request error');

        } else if (response.statusCode == 200) {
            callback(true, body);
            self.log('Response success');

        } else {
            callback(false, body);
            self.log('Response error');
        }
    });

    return this;
};

module.exports = self;
