import { BrokherMapper } from './enums/BrokherMapped'

export function setup (brokherName: string) {
  const brokher = Object.entries(BrokherMapper).filter(([key]) => key === brokherName)[0][1]

  return import(`./contracts/${brokher}`)
    .then(({ default: mod }) => {
      return mod.init()
    })
}
