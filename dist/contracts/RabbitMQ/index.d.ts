import { Channel, Options } from 'amqplib';
import { BrokherContract } from '../BrokherContract';
interface RabbitMQConfig {
    uri: string;
}
export default class RabbitMQ implements BrokherContract<RabbitMQConfig, Options.AssertExchange, Options.AssertQueue> {
    private connectionUrl;
    private exchange;
    private routingKey;
    private ch;
    private conn;
    private queue;
    setConnection({ uri, }: RabbitMQConfig): RabbitMQ;
    static init(): RabbitMQ;
    setExchange(exchange: string): RabbitMQ;
    setQueue(queue: string): RabbitMQ;
    setChannel(channel: string | undefined, options: Options.AssertExchange): RabbitMQ;
    createChannel(): Promise<Channel>;
    private createConnection;
    publish(content: Object): Promise<Boolean>;
    subscribe(listingKey: string, callback: Function, options?: Options.AssertQueue): Promise<void>;
    setRoutingKey(key: string): RabbitMQ;
}
export {};
