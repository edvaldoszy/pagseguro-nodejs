var PagSeguro = require('../index');

var pagseguro = new PagSeguro({
    email: 'edvaldoszy@gmail.com',
    token: 'ACCESS_TOKEN',
    mode: PagSeguro.MODE_SANDBOX,
    debug: true
});

pagseguro.transaction('TRANSACTION_CODE', function(success, response) {
    if (success) {
        console.log('Success');
        console.log(response);
    } else {
        console.log('Error');
        console.error(response);
    }
});