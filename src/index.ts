import { BrokherContract } from './contracts/BrokherContract'
import { BrokherEnum } from './enums/BrokherEnum'

interface BrokherContractResponse extends BrokherContract <any, any>{}

export async function setup (brokher: BrokherEnum) : Promise<BrokherContractResponse> {
  const Contract = await import(`./contracts/${brokher}`)

  return new Contract()
}
