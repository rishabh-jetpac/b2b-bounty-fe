import { apiClient } from '../../../lib/api/client'
import type { RevampDestinationApiRecord, RevampDestinationDirectoryResponse } from '../apiTypes'
import type { Destination } from '../types'
import { prettifyDestinationPageName } from '../utils/destinationFormatting'
import { extractFirstArray, getString, isRecord } from './revampServiceUtils'

const REVAMP_DESTINATIONS_ENDPOINT =
  'https://ssg-orbit-sim.circleslife.co/v1/labs/orbit/catalog/revamp/destinations'

export async function getDestinations() {
  const response = await apiClient.get<RevampDestinationDirectoryResponse>(
    REVAMP_DESTINATIONS_ENDPOINT,
  )

  const rawDestinations = extractFirstArray(response.data)
  const destinations = new Map<string, Destination>()

  for (const rawDestination of rawDestinations) {
    if (!isRecord(rawDestination)) {
      continue
    }

    const destination = normalizeDestination(rawDestination)

    if (!destination) {
      continue
    }

    destinations.set(destination.pageName, destination)
  }

  return Array.from(destinations.values())
}

function normalizeDestination(rawDestination: RevampDestinationApiRecord) {
  const pageName = getString(rawDestination, ['pageName', 'page_name', 'slug'])

  if (!pageName) {
    return null
  }

  const displayName =
    getString(rawDestination, [
      'displayName',
      'display_name',
      'destinationName',
      'destination_name',
      'name',
      'title',
      'label',
      'region',
    ]) ?? prettifyDestinationPageName(pageName)

  return {
    displayName,
    pageName,
  } satisfies Destination
}
