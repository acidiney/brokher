export interface BrokerContract<BrokerConfig, BrokerChannel> {

  createConnection(config: BrokerConfig) : any

  createChannel (channel: string, options: BrokerChannel) : any

  publish (topic: string, content: Object) : Boolean

  subscribe(topicName: string, callback: Function) : any
}
