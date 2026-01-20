import { QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true, // Enable suspense mode globally
      refetchOnWindowFocus: false,
      retry: false, // Disable retries for easier debugging
    },
  },
})
