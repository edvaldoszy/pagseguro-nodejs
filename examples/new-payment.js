var PagSeguro = require('../index');

var payment = new PagSeguro.Payments({
    email: 'edvaldoszy@gmail.com',
    token: '95C758FA85A74C56A4B552B06114471C',
    mode: PagSeguro.Payments.MODE_SANDBOX,
    debug: true
});

payment.currency('BRL');
payment.reference('d99s87das54fdf5s6');

payment.addItem({
    id: '1',
    description: 'Descrição do primeiro produto',
    amount: '40.00',
    quantity: '1'
});

payment.addItem({
    id: '2',
    description: 'Descrição do segundo produto',
    amount: '40.00',
    quantity: '9'
});

payment.sender({
    name: 'Edvaldo Szymonek',
    email: 'edvaldoszy@gmail.com',
    phone: {
        areaCode: '51',
        number: '12345678'
    }
});

payment.shipping({
    type: 1,
    name: 'Edvaldo Szymonek',
    email: 'edvaldoszy@gmail.com',
    address: {
        stree: 'Endereço',
        number: '10',
        city: 'Nome da cidade',
        state: 'PR',
        country: 'BRA'
    }
});

payment.checkout(function(success, response) {
    if (success) {
        console.log('Success');
        console.log(response);
    } else {
        console.log('Error');
        console.error(response);
    }
});
