var request = require('request');
var foreach = require('./lib/foreach');
var Node = require('./lib/xml-node');

var self = function(options) {

    if (!options.email || !options.token)
        throw new Error('You must have an e-mail address and an access token');

    this.email = options.email;
    this.token = options.token;
    this.mode = options.mode || self.MODE_PAYMENT;
    this.debug = options.debug || false;
    this.uri = "";

    switch (this.mode) {
        case self.MODE_PAYMENT:
            this.uri = "https://ws.pagseguro.uol.com.br/v2";
            break;

        case self.MODE_SANDBOX:
            this.uri = "https://ws.sandbox.pagseguro.uol.com.br/v2";
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

self.prototype.log = function(message) {
    if (this.debug)
        console.log('\x1b[33m[DEBUG] ' + message + '\x1b[30m');
};

self.prototype.currency = function(str) {

    this.xml.checkout.add(new Node('currency', str));
    return this;
};

self.prototype.reference = function(str) {

    this.xml.checkout.add(new Node('reference', str));
    return this;
};

self.prototype.redirect = function(url) {

    this.xml.checkout.add(new Node('redirectURL', url));
    return this;
};

self.prototype.notify = function(url) {

    this.xml.checkout.add(new Node('notificationURL', url));
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

    var uri = this.uri + "/checkout?email=" + this.email + "&token=" + this.token;
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

/* Transactions */
self.prototype.transaction = function(code, callback) {
    var self = this;

    var uri = this.uri + "/transactions/" + code + "?email=" + this.email + "&token=" + this.token;
    this.log(uri);

    request({
        method: 'GET',
        uri: uri

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

/* Notifications */
self.prototype.notification = function(code, callback) {
    var self = this;

    var uri = this.uri + "/transactions/notifications/" + code + "?email=" + this.email + "&token=" + this.token;
    this.log(uri);

    request({
        method: 'GET',
        uri: uri

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

self.MODE_PAYMENT = 'payment';
self.MODE_SANDBOX = 'sandbox';

module.exports = self;
