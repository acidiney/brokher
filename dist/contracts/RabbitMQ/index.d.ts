import { Options } from 'amqplib';
import { BrokherContract } from '../BrokherContract';
interface RabbitMQConfig {
    uri: string;
}
export default class RabbitMQ implements BrokherContract<RabbitMQConfig, Options.AssertExchange> {
    private connectionUrl;
    private exchange;
    private routingKey;
    setConnection({ uri }: RabbitMQConfig): RabbitMQ;
    static init(): RabbitMQ;
    setExchange(exchange: string): RabbitMQ;
    setChannel(channel: string | undefined, options: Options.AssertExchange): RabbitMQ;
    createChannel(): Promise<import("amqplib").Channel>;
    private createConnection;
    publish(content: Object): Promise<Boolean>;
    subscribe(listingKey: string, callback: Function): Promise<import("amqplib").Replies.Consume>;
    setRoutingKey(key: string): RabbitMQ;
}
export {};
