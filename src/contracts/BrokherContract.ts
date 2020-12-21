export interface BrokherContract<BrokherConfig, BrokherChannel> {

  setConnection(config: BrokherConfig) : any

  setChannel (channel: string, options: BrokherChannel) : any

  createChannel (connection: any) : any

  publish (topic: string, content: Object) : Promise<Boolean>

  subscribe(topicName: string, callback: Function) : any

}
