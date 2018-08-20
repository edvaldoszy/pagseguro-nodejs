const request = require('request'),
    foreach = require('./lib/foreach'),
    Node = require('./lib/xml-node');

const MODE_PAYMENT = 'payment',
    MODE_SANDBOX = 'sandbox';

function create(options) {
    if (!options.email || !options.token)
        throw new Error('You must have an e-mail address and an access token');

    pagSeguro.email = options.email;
    pagSeguro.token = options.token;
    pagSeguro.mode = options.mode || MODE_PAYMENT;
    pagSeguro.debug = options.debug || false;
    pagSeguro.uri = "";

    switch (pagSeguro.mode) {
        case MODE_PAYMENT:
            pagSeguro.uri = "https://ws.pagseguro.uol.com.br/v2";
            break;

        case MODE_SANDBOX:
            pagSeguro.uri = "https://ws.sandbox.pagseguro.uol.com.br/v2";
            break;
    }

    pagSeguro.xml.checkout.add(pagSeguro.xml.items);

    return pagSeguro;
}

function makePromise(method, uri, headers, body) {
    return new Promise((resolve, reject) => {
        request({
            method: method,
            uri: uri,
            headers: headers,
            body: body
        }, function (error, response, body) {
            if (error) {
                pagSeguro.log('Request error');
                reject(error.message);
            } else if (response.statusCode == 200) {
                pagSeguro.log('Response success');
                resolve(body);
            } else {
                pagSeguro.log('Response error');
                reject(body);
            }
        });
    });
}

const pagSeguro = {
    email: null,
    token: null,
    mode: MODE_PAYMENT,
    debug: false,
    uri: '',
    xml: {
        checkout: new Node('checkout', []),
        item: new Node('items', [])
    },

    log: (message) => {
        if (pagSeguro.debug)
            console.log('\x1b[33m[DEBUG] ' + message + '\x1b[30m');
    },
    currency: (str) => {
        pagSeguro.xml.checkout.add(new Node('currency', str));
        return pagSeguro;
    },
    reference: (str) => {
        pagSeguro.xml.checkout.add(new Node('reference', str));
        return pagSeguro;
    },
    redirect: (url) => {
        pagSeguro.xml.checkout.add(new Node('redirectURL', url));
        return pagSeguro;
    },
    notify: (url) => {
        pagSeguro.xml.checkout.add(new Node('notificationURL', url));
        return pagSeguro;
    },
    addItem: (params) => {
        var item = new Node('item', []);

        foreach(params, function (v, k) {
            item.add(new Node(k, v));
        });

        pagSeguro.xml.items.add(item);
        return pagSeguro;
    },
    sender: (params) => {
        var sender = new Node('sender', []);

        foreach(params, function (v, k) {
            if (k == 'phone' && typeof (v) == 'object') {
                var phone = new Node('phone', []);

                foreach(v, function (v1, k1) {
                    phone.add(new Node(k1, v1));
                });

                sender.add(phone);
            } else {
                sender.add(new Node(k, v));
            }
        });

        pagSeguro.xml.checkout.add(sender);
        return pagSeguro;
    },
    shipping: (params) => {
        var shipping = new Node('shipping', []);

        foreach(params, function (v, k) {
            if (k == 'address' && typeof (v) == 'object') {
                var address = new Node('address', []);

                foreach(v, function (v1, k1) {
                    address.add(new Node(k1, v1));
                });

                shipping.add(address);
            } else {
                shipping.add(new Node(k, v));
            }
        });

        pagSeguro.xml.checkout.add(shipping);
        return pagSeguro;
    },
    checkout: async () => {
        const uri = pagSeguro.uri + "/checkout?email=" + pagSeguro.email + "&token=" + pagSeguro.token;

        pagSeguro.log(uri);

        return makePromise(
            'POST',
            uri,
            {
                'Content-Type': 'application/xml; charset=ISO-8859-1'
            },
            pagSeguro.xml.checkout.toString()
        );
    },
    transaction: async (code, callback) => {
        const uri = pagSeguro.uri + "/transactions/" + code + "?email=" + pagSeguro.email + "&token=" + pagSeguro.token;
        pagSeguro.log(uri);

        return makePromise('GET', uri);
    },
    notification: async (code, callback) => {
        const uri = pagSeguro.uri + "/transactions/notifications/" + code + "?email=" + pagSeguro.email + "&token=" + pagSeguro.token;
        pagSeguro.log(uri);

        return makePromise('GET', uri);
    }
};

module.exports = create;