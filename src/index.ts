import { BrokherContract } from './contracts/BrokherContract'
import { BrokherMapper } from './enums/BrokherMapped'

interface BrokherContractResponse extends BrokherContract <any, any>{}

export async function setup (brokherName: string) : Promise<BrokherContractResponse> {
  const brokher = Object.entries(BrokherMapper).filter(([key]) => key === brokherName)[0][1]

  const Contract = await import(`./contracts/${brokher}`)

  return new Contract()
}
