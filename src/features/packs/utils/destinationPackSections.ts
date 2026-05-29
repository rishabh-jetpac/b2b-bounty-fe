import type { DestinationPackSection, Pack } from '../types'

export function buildDestinationPackSections(packs: Pack[]): DestinationPackSection[] {
  const unlimitedPacks = packs.filter((pack) => pack.dataInGB === -1)
  const packsByValidity = new Map<number, Pack[]>()

  for (const pack of packs) {
    if (pack.dataInGB === -1) {
      continue
    }

    const existingPacks = packsByValidity.get(pack.validityInDays) ?? []
    existingPacks.push(pack)
    packsByValidity.set(pack.validityInDays, existingPacks)
  }

  const validitySections = Array.from(packsByValidity.entries())
    .sort((left, right) => right[0] - left[0])
    .map(([validityInDays, groupedPacks]) => ({
      kind: 'days' as const,
      packs: groupedPacks,
      title: formatSectionTitle(validityInDays),
      validityInDays,
    }))

  return unlimitedPacks.length > 0
    ? [
        {
          kind: 'unlimited',
          title: 'Unlimited',
          packs: unlimitedPacks,
        },
        ...validitySections,
      ]
    : validitySections
}

function formatSectionTitle(validityInDays: number) {
  return `${validityInDays} Day${validityInDays === 1 ? '' : 's'}`
}
