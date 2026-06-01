import type { Pack } from '../types'
import { formatDataAmount } from './packFormatting'

export const MAX_PACK_PURCHASE_QUANTITY = 20

export function clampCheckoutQuantity(quantity: number) {
  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1
  }

  return Math.min(MAX_PACK_PURCHASE_QUANTITY, Math.floor(quantity))
}

export function buildCheckoutPackTitle(destinationTitle: string, pack: Pack) {
  return `${formatDataAmount(pack.dataInGB)} ${destinationTitle} Pack`
}

export function buildPurchaseSuccessMessage(quantity: number, packName: string) {
  return `Purchased ${quantity} x ${packName} successfully.`
}
