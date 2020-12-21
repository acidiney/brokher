import { connect, Connection, Options } from 'amqplib'

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
implements BrokherContract<RabbitMQConfig, Options.AssertExchange> {
  private connectionUrl!: string

  private exchange!: RabbitMQExchange
  private routingKey!: string

  setConnection ({
    uri = 'guest:guest@localhost:5672'
  }: RabbitMQConfig): RabbitMQ {
    this.connectionUrl = `amqp://${uri}`

    return this
  }

  static init (): RabbitMQ {
    return new RabbitMQ()
  }

  setExchange (exchange: string): RabbitMQ {
    this.exchange = {
      ...this.exchange,
      name: exchange
    }

    return this
  }

  setChannel (channel = 'topic', options: Options.AssertExchange): RabbitMQ {
    this.exchange = {
      ...this.exchange,
      channel,
      options
    }

    return this
  }

  async createChannel () {
    const connection = await this.createConnection()
    const ch = await connection.createChannel()

    console.log('[Brokher] - channel created!')
    ch.assertExchange(
      this.exchange.name,
      this.exchange.channel,
      this.exchange.options
    )
    return ch
  }

  private createConnection (): Promise<Connection> {
    return connect(this.connectionUrl)
  }

  async publish (content: Object): Promise<Boolean> {
    const ch = await this.createChannel()

    return ch.publish(
      this.exchange.name,
      this.routingKey,
      Buffer.from(JSON.stringify(content))
    )
  }

  async subscribe (listingKey: string, callback: Function) {
    const ch = await this.createChannel()

    return ch.assertQueue('', { exclusive: true }).then(({ queue }) => {
      console.log(
        '[Brokher] Waiting for bindings on %s. To exit press CTRL+C',
        queue
      )

      const routingKey = `#.${listingKey}.#`

      ch.bindQueue(queue, this.exchange.name, routingKey)

      console.log(' [x] Binded %s', routingKey)

      return ch.consume(queue, (message: any) => {
        try {
          const receivedData = JSON.parse(message?.content.toString() as string)

          callback(receivedData)
        } catch (e) {
          console.log(e)
        }
      })
    })
  }

  setRoutingKey (key: string): RabbitMQ {
    this.routingKey = `${this.exchange}.${key}`

    return this
  }
}
