import { computed, ref, watch } from 'vue'

type SuspenseState = 'pending' | 'resolve' | 'fallback'
type RouterState = 'pending' | 'resolve'
type NavigationState = 'pending' | 'resolve' | 'fallback'

export const suspenseStateMap = ref<Map<string, SuspenseState>>(new Map())
export const routerState = ref<RouterState>('pending')
export const error = ref<Error | null>(null)

const suspenseState = computed<SuspenseState>(() => {
  // if any suspense is pending, the whole state is pending
  if (Array.from(suspenseStateMap.value.values()).some((state) => state === 'pending'))
    return 'pending'
  // if any suspense is in fallback, the whole state is in fallback
  if (Array.from(suspenseStateMap.value.values()).some((state) => state === 'fallback'))
    return 'fallback'
  // otherwise all suspense are resolved
  return 'resolve'
})

export const navigationState = computed<NavigationState>(() => {
  if (suspenseState.value === 'pending' || routerState.value === 'pending') return 'pending'
  if (suspenseState.value === 'fallback') return 'fallback'
  return 'resolve'
})

export const isNavigating = computed(
  () => navigationState.value === 'pending' || navigationState.value === 'fallback',
)

export function setSuspenseError(err: Error) {
  error.value = err
}

export const navigationResolved = ({ timeout = 10_000 }: { timeout?: number } = {}) =>
  new Promise<SuspenseState>((resolve, reject) => {
    // check if already resolved
    if (navigationState.value === 'resolve') {
      resolve(navigationState.value)
      return
    }

    const unwatch = watch(
      navigationState,
      (value) => {
        console.debug('[navigation] Navigation state changed:', value)
        if (value === 'pending' || value === 'fallback') return

        unwatch()
        resolve(value)
      },
      { flush: 'sync' },
    )
    setTimeout(() => {
      unwatch()
      reject(new Error('Suspense state did not resolve within timeout'))
    }, timeout)
  })

export const createSuspenseHandlers = (_key?: string) => {
  const key = _key ?? crypto.randomUUID()
  return {
    resolve() {
      console.debug(`[suspense:${key}] -> resolve`)
      suspenseStateMap.value.set(key, 'resolve')
    },
    pending() {
      console.debug(`[suspense:${key}] -> pending`)
      suspenseStateMap.value.set(key, 'pending')
    },
    fallback() {
      console.debug(`[suspense:${key}] -> fallback`)
      suspenseStateMap.value.set(key, 'fallback')
    },
  }
}

// Debug watcher - enabled by default in playground
watch(navigationState, (value) => {
  console.debug('[navigation] State:', value)
  console.debug('  Suspense state:', suspenseState.value)
  console.debug('  Router state:', routerState.value)
  console.debug('  Suspense map:', Object.fromEntries(suspenseStateMap.value))
})
