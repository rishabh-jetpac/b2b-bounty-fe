type JsonRecord = Record<string, unknown>

export function extractFirstArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value
  }

  if (!isRecord(value)) {
    return []
  }

  const prioritizedKeys = ['data', 'items', 'destinations', 'results', 'packs']

  for (const key of prioritizedKeys) {
    const nestedValue = value[key]

    if (Array.isArray(nestedValue)) {
      return nestedValue
    }
  }

  for (const nestedValue of Object.values(value)) {
    if (Array.isArray(nestedValue)) {
      return nestedValue
    }
  }

  return []
}

export function getBoolean(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key]

    if (typeof value === 'boolean') {
      return value
    }
  }

  return null
}

export function getNumber(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key]

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string') {
      const normalizedValue = value.trim()

      if (!normalizedValue) {
        continue
      }

      if (normalizedValue.toLowerCase() === 'unlimited') {
        return -1
      }

      const parsedValue = Number(normalizedValue)

      if (Number.isFinite(parsedValue)) {
        return parsedValue
      }
    }
  }

  return null
}

export function getString(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key]

    if (typeof value === 'string') {
      const normalizedValue = value.trim()

      if (normalizedValue) {
        return normalizedValue
      }
    }
  }

  return null
}

export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null
}
