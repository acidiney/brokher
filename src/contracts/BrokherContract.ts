export interface BrokherContract<BrokherConfig, BrokherChannel, BrokherOptions> {

  setConnection: (config: BrokherConfig) => any

  setChannel: (channel: string, options: BrokherChannel) => any

  createChannel: (connection: any) => any

  publish: (topic: string, content: Object) => Promise<Boolean>

  subscribe: (topicName: string, callback: (msg: object, ch: any) => Promise<void>, options: BrokherOptions) => any

  setQueue: (queue: string) => any
}
