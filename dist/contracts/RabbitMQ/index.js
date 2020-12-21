"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
class RabbitMQ {
    setConnection({ uri = 'guest:guest@localhost:5672' }) {
        this.connectionUrl = `amqp://${uri}`;
        return this;
    }
    static init() {
        return new RabbitMQ();
    }
    setExchange(exchange) {
        this.exchange = Object.assign(Object.assign({}, this.exchange), { name: exchange });
        return this;
    }
    setChannel(channel = 'topic', options) {
        this.exchange = Object.assign(Object.assign({}, this.exchange), { channel,
            options });
        return this;
    }
    createChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.createConnection();
            const ch = yield connection.createChannel();
            console.log('[Brokher] - channel created!');
            ch.assertExchange(this.exchange.name, this.exchange.channel, this.exchange.options);
            return ch;
        });
    }
    createConnection() {
        return amqplib_1.connect(this.connectionUrl);
    }
    publish(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const ch = yield this.createChannel();
            return ch.publish(this.exchange.name, this.routingKey, Buffer.from(JSON.stringify(content)));
        });
    }
    subscribe(listingKey, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const ch = yield this.createChannel();
            return ch.assertQueue('', { exclusive: true }).then(({ queue }) => {
                console.log('[Brokher] Waiting for bindings on %s. To exit press CTRL+C', queue);
                const routingKey = `#.${listingKey}.#`;
                ch.bindQueue(queue, this.exchange.name, routingKey);
                console.log(' [x] Binded %s', routingKey);
                return ch.consume(queue, (message) => {
                    try {
                        const receivedData = JSON.parse(message === null || message === void 0 ? void 0 : message.content.toString());
                        callback(receivedData);
                    }
                    catch (e) {
                        console.log(e);
                    }
                });
            });
        });
    }
    setRoutingKey(key) {
        this.routingKey = `${this.exchange}.${key}`;
        return this;
    }
}
exports.default = RabbitMQ;
