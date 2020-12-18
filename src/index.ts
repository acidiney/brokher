import { BrokerEnum } from './enums/BrokerEnum'

export class Broker {
  async setup (broker: BrokerEnum) {
    const Contract = await import(`./contracts/${broker}`)

    return new Contract()
  }
}
