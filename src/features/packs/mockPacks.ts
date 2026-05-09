import type { Pack } from './types'

type RawPack = {
  id: string
  title: string
  currency: string
  symbol: string
  amount: number
  dataAllowanceGb: number
  validityDays: number
  countryCode?: string
  countryName?: string
}

const rawPacks: RawPack[] = [
  {
    id: 'my-unlimited-10',
    title: 'Malaysia Unlimited GB',
    currency: 'USD',
    symbol: '$',
    amount: 33.9,
    dataAllowanceGb: -1,
    validityDays: 10,
    countryCode: 'MY',
    countryName: 'Malaysia',
  },
  {
    id: 'my-weekly-5',
    title: 'Malaysia Explorer 5GB',
    currency: 'USD',
    symbol: '$',
    amount: 15,
    dataAllowanceGb: 5,
    validityDays: 7,
    countryCode: 'MY',
    countryName: 'Malaysia',
  },
  {
    id: 'th-daily-1',
    title: 'Thailand Daily 1GB',
    currency: 'USD',
    symbol: '$',
    amount: 5,
    dataAllowanceGb: 1,
    validityDays: 1,
    countryCode: 'TH',
    countryName: 'Thailand',
  },
  {
    id: 'th-flex-3',
    title: 'Thailand Flex 3GB',
    currency: 'USD',
    symbol: '$',
    amount: 12.5,
    dataAllowanceGb: 3,
    validityDays: 5,
    countryCode: 'TH',
    countryName: 'Thailand',
  },
  {
    id: 'sg-weekly-10',
    title: 'Singapore Weekly 10GB',
    currency: 'USD',
    symbol: '$',
    amount: 24,
    dataAllowanceGb: 10,
    validityDays: 7,
    countryCode: 'SG',
    countryName: 'Singapore',
  },
  {
    id: 'sg-monthly-15',
    title: 'Singapore Monthly 15GB',
    currency: 'USD',
    symbol: '$',
    amount: 35,
    dataAllowanceGb: 15,
    validityDays: 30,
    countryCode: 'SG',
    countryName: 'Singapore',
  },
  {
    id: 'jp-pass-20',
    title: 'Japan Travel Pass 20GB',
    currency: 'USD',
    symbol: '$',
    amount: 42,
    dataAllowanceGb: 20,
    validityDays: 15,
    countryCode: 'JP',
    countryName: 'Japan',
  },
  {
    id: 'global-lite-2',
    title: 'Global Lite 2GB',
    currency: 'USD',
    symbol: '$',
    amount: 9.9,
    dataAllowanceGb: 2,
    validityDays: 3,
    countryCode: 'GL',
    countryName: 'Global',
  },
]

function normalizePack(rawPack: RawPack): Pack {
  return {
    id: rawPack.id,
    name: rawPack.title,
    price: {
      currency: rawPack.currency,
      value: rawPack.amount.toFixed(2),
      symbol: rawPack.symbol,
    },
    dataInGB: rawPack.dataAllowanceGb,
    validityInDays: rawPack.validityDays,
    countryInfo:
      rawPack.countryCode && rawPack.countryName
        ? {
            code: rawPack.countryCode,
            display_name: rawPack.countryName,
          }
        : undefined,
  }
}

export const mockPacks = rawPacks.map(normalizePack)
