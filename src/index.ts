import { BrokherEnum } from './enums/BrokherEnum'

export class Brokher {
  static async setup (Brokher: BrokherEnum) {
    const Contract = await import(`./contracts/${Brokher}`)

    return new Contract()
  }
}
