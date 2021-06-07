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
    setConnection({ uri = 'guest:guest@localhost:5672', }) {
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
    setQueue(queue) {
        this.queue = queue;
        return this;
    }
    setChannel(channel = 'topic', options) {
        this.exchange = Object.assign(Object.assign({}, this.exchange), { channel,
            options });
        return this;
    }
    createChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ch) {
                this.ch = yield (yield this.createConnection()).createChannel();
                console.log('[Brokher] - channel created!');
                this.ch.assertExchange(this.exchange.name, this.exchange.channel, this.exchange.options);
            }
            return this.ch;
        });
    }
    createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.conn) {
                this.conn = yield amqplib_1.connect(this.connectionUrl);
            }
            return this.conn;
        });
    }
    publish(content, options = {
        deliveryMode: 2,
        persistent: true
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            const ch = yield this.createChannel();
            return ch.publish(this.exchange.name, this.routingKey, Buffer.from(JSON.stringify(content)), options);
        });
    }
    subscribe(listingKey, callback, options = {
        durable: true,
        exclusive: false,
        autoDelete: false,
        messageTtl: 60000,
        deadLetterExchange: 'webhook',
        deadLetterRoutingKey: '#.dead.#',
        expires: 60000,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            const ch = yield this.createChannel();
            try {
                const { queue } = yield ch.assertQueue(this.queue || '', options);
                console.log('[Brokher] Waiting for bindings on %s. To exit press CTRL+C', queue);
                const routingKey = `#.${listingKey}.#`;
                ch.bindQueue(queue, this.exchange.name, routingKey);
                console.log(' [x] Binded %s', routingKey);
                yield ch.consume(queue, (message) => __awaiter(this, void 0, void 0, function* () {
                    let receivedData;
                    try {
                        receivedData = JSON.parse(message === null || message === void 0 ? void 0 : message.content.toString());
                    }
                    catch (_a) {
                        receivedData = message === null || message === void 0 ? void 0 : message.content.toString();
                    }
                    yield callback(receivedData);
                    this.ch.ack(message);
                }), {
                    noAck: false,
                });
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    setRoutingKey(key) {
        this.routingKey = `${this.exchange}.${key}`;
        return this;
    }
}
exports.default = RabbitMQ;
