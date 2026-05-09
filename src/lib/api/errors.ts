import axios from 'axios'

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.',
) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData
    }

    if (responseData && typeof responseData === 'object') {
      const errorShape = responseData as Record<string, unknown>

      for (const key of ['message', 'error', 'detail'] as const) {
        const value = errorShape[key]

        if (typeof value === 'string' && value.trim()) {
          return value
        }
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}
