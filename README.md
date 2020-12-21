# Brokher
Brokher is a simple ORM to manage message brokers in your applications.

## Motivation

When you need to change your current message broker for other, you may need to change some code in your application.
The General Ideia of use *brokher* is simple change your .env and voila.

### Instalation Process
You can find **Brokher** on npm or yarn simple using:
```bash
$ npm install brokher

// or

$ yarn add brokher
```

### Usage
After install **Brokher** you need to install your base Brokher lib, in this example I will use RabbitMQ with `amqlib`, so install this lib with
```bash
$ npm install amqlib

```

After installing the lib, you need to config Brokher to use your prefered contract, like bellow:

```js

const Brokher = require('brokher');

async function main () {
  
  const brokher = Brokher.setup('rabbit');
  
  /* for pushing some information */
  await brokher
    .setConnection({ uri: 'rabbitmq_credentials' }) // guest:guest@localhost:5672
    .setChannel('topic', { durable: null })
    .setExchange('logs')
    .setRoutingKey('normal')
    .publish({ message: 'Hello, from Brokher');
    
    
  /* for listing some information */
   await brokher
    .setConnection({ uri: 'rabbitmq_credentials' })
    .setExchange('logs')
    .setChannel('topic', { durable: false })
    .setRoutingKey('normal')
    .subscribe('normal', (message) => {
       console.log(message);
    })
}

```

### The Brokher API
Brokher implements the same contract to every supported Broker, so the principal ideia is *don't change your code*


## Methods

#### setConnection
#### setExchange
#### setChannel
#### setChannel
#### setRoutingKey
#### publish
#### subscribe


## Support

- [X] RabbitMQ
- [ ] Apache Kafka

#### Author
Acidiney Dias

### License
MIT
