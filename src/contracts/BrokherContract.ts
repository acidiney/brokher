export interface BrokherContract<BrokherConfig, BrokherChannel> {

  createConnection(config: BrokherConfig) : any

  createChannel (channel: string, options: BrokherChannel) : any

  publish (topic: string, content: Object) : Boolean

  subscribe(topicName: string, callback: Function) : any
}
