import { BrokherContract } from './contracts/BrokherContract'
import { BrokherMapper } from './enums/BrokherMapped'
interface BrokherInterface extends BrokherContract<any, any, any> {
  init() : BrokherInterface
}

export function setup (brokherName: string) : Promise<BrokherInterface> {
  const brokher = Object.entries(BrokherMapper).filter(([key]) => key === brokherName)[0][1]

  return import(`./contracts/${brokher}`)
    .then(({ default: mod }) => {
      return mod.init()
    })
}
