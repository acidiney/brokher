import { BrokherEnum } from './enums/BrokherEnum'

export class Brokher {
  async setup (Brokher: BrokherEnum) {
    const Contract = await import(`./contracts/${Brokher}`)

    return new Contract()
  }
}
