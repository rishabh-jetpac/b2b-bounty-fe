export function hasAdminAccess(role?: string) {
  return role === 'admin' || role === 'organization_owner'
}
