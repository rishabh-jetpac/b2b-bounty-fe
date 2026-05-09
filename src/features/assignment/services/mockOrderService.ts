import type { Pack } from '../../packs/types'
import type { OrderResponse } from '../types'

const mockOrders = new Map<string, OrderResponse>()
const serviceDelayMs = 250

export class MockOrderNotFoundError extends Error {
  constructor(orderId: string) {
    super(`Order ${orderId} was not found.`)
    this.name = 'MockOrderNotFoundError'
  }
}

function wait(delayMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs)
  })
}

function createOrderId() {
  return `ord_${Math.random().toString(36).slice(2, 10)}`
}

export async function createMockOrderFromPurchase(
  pack: Pack,
  quantity: number,
): Promise<OrderResponse> {
  await wait(serviceDelayMs)

  const order: OrderResponse = {
    order_id: createOrderId(),
    pack: {
      catalog_id: pack.id,
      displayName: pack.name,
    },
    quantity,
    timestamp: new Date().toISOString(),
  }

  mockOrders.set(order.order_id, order)

  return order
}

export async function getOrderById(orderId: string): Promise<OrderResponse> {
  await wait(serviceDelayMs)

  const order = mockOrders.get(orderId)

  if (!order) {
    throw new MockOrderNotFoundError(orderId)
  }

  return order
}
