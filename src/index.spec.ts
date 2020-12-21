/* eslint-disable no-undef */
import { setup } from '.'

let contract: any

beforeEach(async () => {
  contract = await setup('rabbit')
})

describe('Brokher', () => {
  test('setup contract', async () => {
    expect(contract).toBeDefined()
  })

  test('createConnection need exist', async () => {
    expect(contract.setConnection).toBeDefined()
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

  test('test chain pattern', async () => {
    expect(
      await contract
        .setConnection({ uri: 'guest:guest@localhost:5672' })
        .setExchange('logs')
        .setChannel('topic', { durable: false })
        .setRoutingKey('normal')
        .publish({ message: 'ok' })
    ).toBeTruthy()
  })
})
