import { Channel, connect, Connection, Options } from 'amqplib';

import { BrokherContract } from '../BrokherContract';

interface RabbitMQConfig {
  uri: string;
}

interface RabbitMQExchange {
  name: string;
  channel: string;
  options: Options.AssertExchange;
}

export default class RabbitMQ
  implements
    BrokherContract<
      RabbitMQConfig,
      Options.AssertExchange,
      Options.AssertQueue
    >
{
  private connectionUrl!: string;

  private exchange!: RabbitMQExchange;
  private routingKey!: string;
  private ch!: Channel;
  private conn!: Connection;
  private queue!: string;

  setConnection({
    uri = 'guest:guest@localhost:5672',
  }: RabbitMQConfig): RabbitMQ {
    this.connectionUrl = `amqp://${uri}`;

    return this;
  }

  static init(): RabbitMQ {
    return new RabbitMQ();
  }

  setExchange(exchange: string): RabbitMQ {
    this.exchange = {
      ...this.exchange,
      name: exchange,
    };

    return this;
  }

  setQueue(queue: string): RabbitMQ {
    this.queue = queue;
    return this;
  }

  setChannel(channel = 'topic', options: Options.AssertExchange): RabbitMQ {
    this.exchange = {
      ...this.exchange,
      channel,
      options,
    };

    return this;
  }

  async createChannel() {
    if (!this.ch) {
      this.ch = await (await this.createConnection()).createChannel();

      console.log('[Brokher] - channel created!');
      this.ch.assertExchange(
        this.exchange.name,
        this.exchange.channel,
        this.exchange.options
      );
    }

    return this.ch;
  }

  private async createConnection(): Promise<Connection> {
    if (!this.conn) {
      this.conn = await connect(this.connectionUrl);
    }

    return this.conn;
  }

  async publish(content: Object, options: Options.Publish = {
    deliveryMode: 2,
    persistent: true
  }): Promise<Boolean> {
    const ch = await this.createChannel();

    return ch.publish(
      this.exchange.name,
      this.routingKey,
      Buffer.from(JSON.stringify(content)),
      options,
    );
  }

  async subscribe(
    listingKey: string,
    callback: Function,
    options: Options.AssertQueue = {
      durable: true,
      exclusive: false,
      autoDelete: false,
      messageTtl: 60000,
      deadLetterExchange: 'webhook',
      deadLetterRoutingKey: '#.dead.#',
      expires: 60000,
    }
  ) {
    const ch = await this.createChannel();
    try {
      const { queue } = await ch.assertQueue(this.queue || '', options);

      console.log(
        '[Brokher] Waiting for bindings on %s. To exit press CTRL+C',
        queue
      );

      const routingKey = `#.${listingKey}.#`;

      ch.bindQueue(queue, this.exchange.name, routingKey);

      console.log(' [x] Binded %s', routingKey);

      await ch.consume(
        queue,
        async (message: any) => {
          let receivedData;

          try {
            receivedData = JSON.parse(
              message?.content.toString() as string
            );
          } catch {
            receivedData = message?.content.toString() as string;
          }

          await callback(receivedData);
          this.ch.ack(message);
        },
        {
          noAck: false,
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  setRoutingKey(key: string): RabbitMQ {
    this.routingKey = `${this.exchange}.${key}`;

    return this;
  }
}
