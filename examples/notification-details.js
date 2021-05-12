var PagSeguro = require('../index');

var pagseguro = PagSeguro({
    email: 'edvaldoszy@gmail.com',
    token: 'ACCESS_TOKEN',
    mode: 'sandbox',
    debug: true
});

pagseguro.notification('NOTIFICATION_CODE')
    .then(response => {
        console.log('Success');
        console.log(response);
    }).catch(error => {
        console.log('Error');
        console.error(error);
    });