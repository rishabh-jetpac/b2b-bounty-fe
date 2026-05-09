export type CountryInfo = {
  display_name: string
  code: string
}

export type Pack = {
  id: string
  name: string
  price: {
    currency: string
    value: string
    symbol: string
  }
  dataInGB: number
  validityInDays: number
  countryInfo?: CountryInfo
}

export type PacksFilters = {
  country?: string
  validityInDays?: number
  dataInGB?: number
}

export type FilterSheetKey = 'country' | 'validityInDays' | 'dataInGB'
