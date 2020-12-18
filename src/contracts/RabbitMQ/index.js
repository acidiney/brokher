"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQ = void 0;
var amqplib_1 = require("amqplib");
var RabbitMQ = /** @class */ (function () {
    function RabbitMQ() {
    }
    RabbitMQ.prototype.createConnection = function (_a) {
        var _this = this;
        var _b = _a.uri, uri = _b === void 0 ? 'guest:guest@localhost:5672' : _b;
        return amqplib_1.connect("amqp://" + uri).then(function (conn) {
            _this.connection = conn;
            return _this;
        });
    };
    RabbitMQ.prototype.setExchange = function (exchange) {
        this.exchange = exchange;
        return this;
    };
    RabbitMQ.prototype.createChannel = function (channel, options) {
        var _this = this;
        if (channel === void 0) { channel = 'topic'; }
        return this.connection.createChannel().then(function (ch) {
            console.log('[broker] - channel created!');
            ch.assertExchange(_this.exchange, channel, options);
            _this.channel = ch;
            return _this;
        });
    };
    RabbitMQ.prototype.publish = function (content) {
        return this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(content)));
    };
    RabbitMQ.prototype.subscribe = function (listingKey, callback) {
        var _this = this;
        return this.channel
            .assertQueue('', { exclusive: true })
            .then(function (_a) {
            var queue = _a.queue;
            console.log('[broker] Waiting for bindings on %s. To exit press CTRL+C', queue);
            var routingKey = "#." + listingKey + ".#";
            _this.channel.bindQueue(queue, _this.exchange, routingKey);
            console.log(' [x] Binded %s', routingKey);
            return _this.channel.consume(queue, function (message) {
                try {
                    var receivedData = JSON.parse(message === null || message === void 0 ? void 0 : message.content.toString());
                    callback(receivedData);
                }
                catch (e) {
                    console.log(e);
                }
            });
        });
    };
    RabbitMQ.prototype.setRoutingKey = function (key) {
        this.routingKey = this.exchange + "." + key;
    };
    return RabbitMQ;
}());
exports.RabbitMQ = RabbitMQ;
