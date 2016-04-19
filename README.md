# pagseguro-nodejs
Biblioteca para integração do UOL PagSeguro com Nodejs

## Instalação
`npm install pagseguro-nodejs --save`

## Como usar

### Pagamentos

**Inicializando**
```
var PagSeguro = require('pagseguro-nodejs');

var pagseguro = new PagSeguro({
    email: 'edvaldoszy@gmail.com',
    token: 'ACCESS_TOKEN'
});
```

**Configuração de moeda e referência do pagamento**
```
pagseguro.currency('BRL');
pagseguro.reference('REFERENCE_CODE');
```

**Adicionando produtos**
```
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
```

**Configurando informações do comprador**
```
pagseguro.sender({
    name: 'Edvaldo Szymonek',
    email: 'edvaldoszy@gmail.com',
    phone: {
        areaCode: '51',
        number: '12345678'
    }
});
```

**Configurando entrega do pedido**
```
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
```

**Enviando informações**
```
pagseguro.checkout(function(success, response) {
    if (success) {
        console.log('Success');
        console.log(response);
    } else {
        console.log('Error');
        console.error(response);
    }
});
```

### Transações

**Checando transação através do código**
```
pagseguro.transaction('TRANSACTION_CODE', function(success, response) {
    if (success) {
        console.log('Success');
        console.log(response);
    } else {
        console.log('Error');
        console.error(response);
    }
});
```

### Notificaçoes

**Checando transação através do código de noificação***
```
pagseguro.notification('NOTIFICATION_CODE', function(success, response) {
    if (success) {
        console.log('Success');
        console.log(response);
    } else {
        console.log('Error');
        console.error(response);
    }
});
```