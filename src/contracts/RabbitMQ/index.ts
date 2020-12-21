import { Channel, connect, Connection, Options } from 'amqplib'

import { BrokherContract } from '../BrokherContract'

interface RabbitMQConfig {
  uri: string
}

export default class RabbitMQ
implements BrokherContract<RabbitMQConfig, Options.AssertExchange> {
  private channel!: Channel
  private connection!: Connection

  private exchange!: string
  private routingKey!: string

  createConnection ({ uri = 'guest:guest@localhost:5672' }) {
    return connect(`amqp://${uri}`).then((conn) => {
      this.connection = conn

      return this
    })
  }

  static init () {
    return new RabbitMQ()
  }

  setExchange (exchange: string) {
    this.exchange = exchange

    return this
  }

  createChannel (channel = 'topic', options: Options.AssertExchange) {
    return this.connection.createChannel().then((ch) => {
      console.log('[Brokher] - channel created!')

      ch.assertExchange(this.exchange, channel, options)

      this.channel = ch

      return this
    })
  }

  publish (content: Object): Boolean {
    return this.channel.publish(
      this.exchange,
      this.routingKey,
      Buffer.from(JSON.stringify(content))
    )
  }

  subscribe (listingKey: string, callback: Function) {
    return this.channel
      .assertQueue('', { exclusive: true })
      .then(({ queue }) => {
        console.log(
          '[Brokher] Waiting for bindings on %s. To exit press CTRL+C',
          queue
        )

        const routingKey = `#.${listingKey}.#`

        this.channel.bindQueue(queue, this.exchange, routingKey)

        console.log(' [x] Binded %s', routingKey)

        return this.channel.consume(queue, (message) => {
          try {
            const receivedData = JSON.parse(message?.content.toString() as string)

            callback(receivedData)
          } catch (e) {
            console.log(e)
          }
        })
      })
  }

  setRoutingKey (key: string): void {
    this.routingKey = `${this.exchange}.${key}`
  }
}
