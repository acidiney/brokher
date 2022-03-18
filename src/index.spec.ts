import { setup } from '.'
import RabbitMQ from './contracts/RabbitMQ'

let contract: RabbitMQ

describe('Brokher', () => {
  beforeEach(async () => {
    contract = (await setup('rabbit')) as unknown as RabbitMQ
  })
  test('setup contract', async () => {
    expect(contract).toBeDefined()
  })

  test('createConnection need exist', async () => {
    expect(contract.setConnection).toBeDefined()
  })
  test('setExchange need exist', async () => {
    expect(contract).toBeDefined()
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

  test('should add prefix to exchange if BROKHER_PREFIX exists', () => {
    process.env.BROKHER_PREFIX = 'test'

    contract.setExchange('valid_exchange')

    expect(contract.exchangeName).toBe('test_valid_exchange')
  })

  test('should not add prefix to exchange if BROKHER_PREFIX don\'t exists', () => {
    delete process.env.BROKHER_PREFIX

    contract.setExchange('valid_exchange')

    expect(contract.exchangeName).toBe('valid_exchange')
  })

  test('test chain pattern', async () => {
    jest.spyOn(contract, 'publish').mockImplementationOnce((obj: any) => {
      return obj
    })

    const promise = contract
      .setConnection({ uri: 'guest:guest@localhost:5672' })
      .setExchange('logs')
      .setChannel('topic', { durable: false })
      .setRoutingKey('normal')
      .publish({ message: 'ok' })

    expect(
      promise
    ).toBeTruthy()
  })
})
