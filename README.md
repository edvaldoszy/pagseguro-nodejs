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
    email: 'name@example.com',
    token: 'ACCESS_TOKEN'
});
```

**Modo e Debug**
```
var pagseguro = new PagSeguro({
    ...
    mode: (PagSeguro.MODE_PAYMENT | PagSeguro.MODE_SANDBOX),
    debug: (true | false)
});
```

**Configuração da moeda e referência do pagamento**
```
pagseguro.currency('BRL');
pagseguro.reference('REFERENCE_CODE');
```

**Configuração das URLs de redirecionamento e notificação (opcional)**
```
pagseguro.redirect('http://www.example.com/callback');
pagseguro.notify('http://www.example.com/notify');
```

**Adicionando produtos**

A documentaçao completa dos parametros pode se encontrada no site do [PagSeguro](https://pagseguro.uol.com.br/v2/guia-de-integracao/api-de-pagamentos.html#v2-item-api-de-pagamentos-formato-xml)

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
    name: 'Some name',
    email: 'name@example.com',
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
    name: 'Some name',
    email: 'name@example.com',
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

**Checando transação através do código de notificação**
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
