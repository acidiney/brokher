/* eslint-disable no-undef */
import RabbitMQ from './index'

let contract: any

beforeEach(() => {
  contract = RabbitMQ.init()
})

describe('RabbitMQ Contract', () => {
  test('Contract need be defined', async () => {
    expect(contract).toBeDefined()
  })
})
