export function buildAuthUserName(firstName?: string, lastName?: string) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()

  return fullName || undefined
}
