import { Channel, connect, Connection, Options } from 'amqplib'

import { BrokherContract } from '../BrokherContract'

interface RabbitMQConfig {
  uri: string
}

interface RabbitMQExchange {
  name: string
  channel: string
  options: Options.AssertExchange
}

export default class RabbitMQ
implements
    BrokherContract<
    RabbitMQConfig,
    Options.AssertExchange,
    Options.AssertQueue
    > {
  private connectionUrl: string = ''

  private exchange?: RabbitMQExchange
  private routingKey?: string
  private ch?: Channel
  private conn?: Connection
  private queue?: string

  setConnection ({
    uri = 'guest:guest@localhost:5672'
  }: RabbitMQConfig): RabbitMQ {
    this.connectionUrl = `amqp://${uri}`

    return this
  }

  get exchangeName (): string | undefined {
    return this.exchange?.name
  }

  private static setPrefix (text: string): string {
    const prefix = process.env.BROKHER_PREFIX
    if (!prefix) return text

    return `${prefix}_${text}`
  }

  static init (): RabbitMQ {
    return new RabbitMQ()
  }

  setExchange (exchange: string): RabbitMQ {
    this.exchange = {
      ...this.exchange,
      name: RabbitMQ.setPrefix(exchange)
    } as RabbitMQExchange

    return this
  }

  setQueue (queue: string): RabbitMQ {
    this.queue = queue
    return this
  }

  setChannel (channel = 'topic', options: Options.AssertExchange): RabbitMQ {
    this.exchange = {
      ...this.exchange,
      channel,
      options
    } as RabbitMQExchange

    return this
  }

  private static logging (text: string, ...options: any): void {
    console.log(`[Brokher] (${(new Date()).toLocaleDateString()}) -`, text, ...options)
  }

  async createChannel (): Promise<Channel> {
    if (!this.ch) {
      this.ch = await (await this.createConnection()).createChannel()

      RabbitMQ.logging('channel created!')

      if (this.exchange) {
        await this.ch.assertExchange(
          this.exchange.name,
          this.exchange.channel,
          this.exchange.options
        )
      }
    }

    return this.ch
  }

  private async createConnection (): Promise<Connection> {
    if (!this.conn) {
      this.conn = await connect(this.connectionUrl)
    }

    return this.conn
  }

  async publish (content: Object): Promise<Boolean> {
    const ch = await this.createChannel()

    if (!this.exchange || !this.routingKey) return false

    return ch.publish(
      this.exchange.name,
      this.routingKey,
      Buffer.from(JSON.stringify(content)),
      {
        persistent: true,
      }
    )
  }

  async subscribe (
    listingKey: string,
    callback: (msg: object, ch: Channel) => Promise<void>,
    options: Options.AssertQueue = {
      durable: true,
      exclusive: false,
      autoDelete: false,
      messageTtl: 60_000_000,
      deadLetterExchange: 'webhook',
      deadLetterRoutingKey: '#.dead.#',
      expires: 60_000_000
    }
  ) {
    const ch = await this.createChannel()
    try {
      const { queue } = await ch.assertQueue(this.queue ?? '', options)

      RabbitMQ.logging('Waiting for bindings on %s. To exit press CTRL+C', queue)

      const routingKey = `#.${listingKey}.#`

      if (this.exchange) {
        await ch.bindQueue(queue, this.exchange.name, routingKey)

        RabbitMQ.logging(`Binding ${routingKey}`)

        await ch.consume(
          queue,
          async (message: any) => {
            let receivedData

            try {
              receivedData = JSON.parse(
                message?.content.toString() as string
              )
            } catch {
              receivedData = message?.content.toString() as string
            }

            if (this.ch) {
              await callback(receivedData, this.ch)
            }
          },
          {
            noAck: false
          }
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  setRoutingKey (key: string): RabbitMQ {
    if (this.exchange) {
      this.routingKey = `${this.exchange.name}.${key}`
    }

    return this
  }
}
