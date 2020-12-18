import { setup } from '.'

let contract: any

beforeEach(async () => {
  const Contract = await setup('rabbit')

  contract = new Contract()
})

describe('Brokher', () => {
  test('setup contract', async () => {
    const contract = await setup('rabbit')

    expect(contract).toBeDefined()
  })

  test('createConnection need exist', async () => {
    expect(contract.createConnection).toBeDefined()
  })
  test('setExchange need exist', async () => {
    expect(contract.setExchange).toBeDefined()
  })
  test('setRoutingKey need exist', async () => {
    expect(contract.setRoutingKey).toBeDefined()
  })
  test('publish need exist', async () => {
    expect(contract.publish).toBeDefined()
  })
  test('subscribe need exist', async () => {
    expect(contract.subscribe).toBeDefined()
  })
})
