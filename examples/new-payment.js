var PagSeguro = require('../index');

var pagseguro = new PagSeguro({
    email: 'edvaldoszy@gmail.com',
    token: 'ACCESS_TOKEN',
    mode: PagSeguro.MODE_SANDBOX,
    debug: true
});

pagseguro.currency('BRL');
pagseguro.reference('REFERENCE_CODE');

pagseguro.addItem({
    id: '1',
    description: 'Descrição do primeiro produto',
    amount: '40.00',
    quantity: '1'
});

pagseguro.addItem({
    id: '2',
    description: 'Descrição do segundo produto',
    amount: '40.00',
    quantity: '9'
});

pagseguro.sender({
    name: 'Edvaldo Szymonek',
    email: 'edvaldoszy@gmail.com',
    phone: {
        areaCode: '51',
        number: '12345678'
    }
});

pagseguro.shipping({
    type: 1,
    name: 'Edvaldo Szymonek',
    email: 'edvaldoszy@gmail.com',
    address: {
        street: 'Endereço',
        number: '10',
        city: 'Nome da cidade',
        state: 'PR',
        country: 'BRA'
    }
});

pagseguro.checkout(function(success, response) {
    if (success) {
        console.log('Success');
        console.log(response);
    } else {
        console.log('Error');
        console.error(response);
    }
});
