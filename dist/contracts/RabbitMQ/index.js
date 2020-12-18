"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
class RabbitMQ {
    createConnection({ uri = 'guest:guest@localhost:5672' }) {
        return amqplib_1.connect(`amqp://${uri}`).then((conn) => {
            this.connection = conn;
            return this;
        });
    }
    setExchange(exchange) {
        this.exchange = exchange;
        return this;
    }
    createChannel(channel = 'topic', options) {
        return this.connection.createChannel().then((ch) => {
            console.log('[Brokher] - channel created!');
            ch.assertExchange(this.exchange, channel, options);
            this.channel = ch;
            return this;
        });
    }
    publish(content) {
        return this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(content)));
    }
    subscribe(listingKey, callback) {
        return this.channel
            .assertQueue('', { exclusive: true })
            .then(({ queue }) => {
            console.log('[Brokher] Waiting for bindings on %s. To exit press CTRL+C', queue);
            const routingKey = `#.${listingKey}.#`;
            this.channel.bindQueue(queue, this.exchange, routingKey);
            console.log(' [x] Binded %s', routingKey);
            return this.channel.consume(queue, (message) => {
                try {
                    const receivedData = JSON.parse(message === null || message === void 0 ? void 0 : message.content.toString());
                    callback(receivedData);
                }
                catch (e) {
                    console.log(e);
                }
            });
        });
    }
    setRoutingKey(key) {
        this.routingKey = `${this.exchange}.${key}`;
    }
}
exports.default = RabbitMQ;
