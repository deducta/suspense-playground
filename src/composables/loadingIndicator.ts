// Based on https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/loading-indicator.ts
import { computed, getCurrentScope, onScopeDispose, shallowRef } from 'vue'
import type { Ref } from 'vue'

export type LoadingIndicatorOpts = {
  /** @default 2000 */
  duration: number
  /** @default 200 */
  throttle: number
  /** @default 500 */
  hideDelay: number
  /** @default 400 */
  resetDelay: number
  /**
   * You can provide a custom function to customize the progress estimation,
   * which is a function that receives the duration of the loading bar (above)
   * and the elapsed time. It should return a value between 0 and 100.
   */
  estimatedProgress?: (duration: number, elapsed: number) => number
}

export type LoadingIndicator = {
  _cleanup: () => void
  progress: Ref<number>
  isLoading: Ref<boolean>
  error: Ref<boolean>
  start: (opts?: { force?: boolean }) => void
  set: (value: number, opts?: { force?: boolean }) => void
  finish: (opts?: { force?: boolean; error?: boolean }) => void
  clear: () => void
}

function defaultEstimatedProgress(duration: number, elapsed: number): number {
  const completionPercentage = (elapsed / duration) * 100
  return (2 / Math.PI) * 100 * Math.atan(completionPercentage / 50)
}

function createLoadingIndicator(opts: Partial<LoadingIndicatorOpts> = {}) {
  const { duration = 2000, throttle = 200, hideDelay = 500, resetDelay = 400 } = opts
  const getProgress = opts.estimatedProgress || defaultEstimatedProgress
  const progress = shallowRef(0)
  const isLoading = shallowRef(false)
  const error = shallowRef(false)
  let done = false
  let rafId: number

  let throttleTimeout: ReturnType<typeof setTimeout>
  let hideTimeout: ReturnType<typeof setTimeout>
  let resetTimeout: ReturnType<typeof setTimeout>

  const start = (opts: { force?: boolean } = {}) => {
    _clearTimeouts()
    error.value = false
    set(0, opts)
  }

  function set(at = 0, opts: { force?: boolean } = {}) {
    if (at >= 100) {
      return finish({ force: opts.force })
    }
    clear()
    progress.value = at < 0 ? 0 : at
    const throttleTime = opts.force ? 0 : throttle
    if (throttleTime) {
      throttleTimeout = setTimeout(() => {
        isLoading.value = true
        _startProgress()
      }, throttleTime)
    } else {
      isLoading.value = true
      _startProgress()
    }
  }

  function _hide() {
    hideTimeout = setTimeout(() => {
      isLoading.value = false
      resetTimeout = setTimeout(() => {
        progress.value = 0
      }, resetDelay)
    }, hideDelay)
  }

  function finish(opts: { force?: boolean; error?: boolean } = {}) {
    progress.value = 100
    done = true
    clear()
    _clearTimeouts()
    if (opts.error) {
      error.value = true
    }
    if (opts.force) {
      progress.value = 0
      isLoading.value = false
    } else {
      _hide()
    }
  }

  function _clearTimeouts() {
    clearTimeout(hideTimeout)
    clearTimeout(resetTimeout)
  }

  function clear() {
    clearTimeout(throttleTimeout)
    cancelAnimationFrame(rafId)
  }

  function _startProgress() {
    done = false
    let startTimeStamp: number

    function step(timeStamp: number): void {
      if (done) {
        return
      }

      startTimeStamp ??= timeStamp
      const elapsed = timeStamp - startTimeStamp
      progress.value = Math.max(0, Math.min(100, getProgress(duration, elapsed)))
      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
  }

  const _cleanup = () => {
    clear()
  }

  return {
    _cleanup,
    progress: computed(() => progress.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    start,
    set,
    finish,
    clear,
  }
}

/**
 * Composable to handle the loading state of the page
 */
let globalIndicator: LoadingIndicator | null = null

export function useLoadingIndicator(
  opts: Partial<LoadingIndicatorOpts> = {},
): Omit<LoadingIndicator, '_cleanup'> {
  if (!globalIndicator) {
    globalIndicator = createLoadingIndicator(opts)
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      globalIndicator?._cleanup()
      globalIndicator = null
    })
  }

  return globalIndicator
}
