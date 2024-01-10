import type { ComponentPublicInstance, MaybeRef } from 'vue'
import { unref } from 'vue'

export function convertToUnit (str: number, unit?: string): string
export function convertToUnit (str: string | number | null | undefined, unit?: string): string | undefined
export function convertToUnit (str: string | number | null | undefined, unit = 'px'): string | undefined {
  if (str == null || str === '') {
    return undefined
  } else if (isNaN(+str!)) {
    return String(str)
  } else if (!isFinite(+str!)) {
    return undefined
  } else {
    return `${Number(str)}${unit}`
  }
}

export function refElement (obj?: ComponentPublicInstance<any> | HTMLElement): HTMLElement | undefined {
  if (obj && '$el' in obj) {
    const el = obj.$el as HTMLElement
    if (el?.nodeType === Node.TEXT_NODE) {
      // Multi-root component, use the first element
      return el.nextElementSibling as HTMLElement
    }
    return el
  }
  return obj as HTMLElement
}

export function debounce (fn: Function, delay: MaybeRef<number>) {
  let timeoutId = 0 as any
  const wrap = (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), unref(delay))
  }
  wrap.clear = () => {
    clearTimeout(timeoutId)
  }
  wrap.immediate = fn
  return wrap
}

export function clamp (value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}
