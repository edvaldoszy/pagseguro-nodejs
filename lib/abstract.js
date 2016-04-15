var self = function(options) {

    if (!options.email || !options.token)
        throw new Error('You must have an e-mail address and access token');

    this.thenCallback = function(response) {};
    this.catchCallback = function(message) {};

    this.email = options.email;
    this.token = options.token;
    this.mode = options.mode || self.MODE_PAYMENT;
    this.debug = options.debug || false;
    this.uri = "";

    // O método init é implementado nas classes que extendem de abstract como um construtor
    this.init();
};

self.prototype.log = function(message) {
    if (this.debug)
        console.log('[DEBUG] ' + message);
};

self.prototype.then = function(callback) {
    this.thenCallback = callback;
    return this;
};

self.prototype.catch = function(callback) {
    this.catchCallback = callback;
    return this;
};

self.MODE_PAYMENT = 'payment';
self.MODE_SANDBOX = 'sandbox';

module.exports = self;