const redactedFields = ['password', 'accessToken']

// We don't want to log passwords in prod
export const redactFields = (obj: Record<string, unknown>) => {
  return Object.keys(obj).reduce(
    (prev, key) => ({
      ...prev,
      [key]: redactedFields.includes(key) ? '<REDACTED>' : obj[key]
    }),
    {}
  )
}
