const uppercaseRegionLabels = new Map([
  ['eu', 'EU'],
  ['esim', 'eSIM'],
  ['uae', 'UAE'],
  ['uk', 'UK'],
  ['usa', 'USA'],
  ['us', 'US'],
])

export function normalizeSearchQuery(query: string) {
  return query.trim()
}

export function prettifyDestinationPageName(pageName: string) {
  return normalizeRegionLabel(pageName.replace(/-+/g, ' '))
}

export function normalizeRegionLabel(region: string) {
  const sanitizedRegion = region.trim().replace(/[_-]+/g, ' ')

  if (!sanitizedRegion) {
    return ''
  }

  return sanitizedRegion
    .split(/\s+/)
    .map((segment) => {
      const lowercaseSegment = segment.toLowerCase()
      const uppercaseMatch = uppercaseRegionLabels.get(lowercaseSegment)

      if (uppercaseMatch) {
        return uppercaseMatch
      }

      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    })
    .join(' ')
}
