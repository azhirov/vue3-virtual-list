import { shallowRef } from 'vue'
import { IN_BROWSER } from '@/utils/globals'


export type SSROptions = boolean | {
  clientWidth: number
  clientHeight?: number
}

function getClientWidth (ssr?: SSROptions) {
  return IN_BROWSER && !ssr
    ? window.innerWidth
    : (typeof ssr === 'object' && ssr.clientWidth) || 0
}

function getClientHeight (ssr?: SSROptions) {
  return IN_BROWSER && !ssr
    ? window.innerHeight
    : (typeof ssr === 'object' && ssr.clientHeight) || 0
}

export function useDisplay (ssr?: SSROptions) {
  const height = shallowRef(getClientHeight(ssr))
  const width = shallowRef(getClientWidth(ssr))

  function update () {
    height.value = getClientHeight()
    width.value = getClientWidth()
  }

  if (IN_BROWSER) {
    window.addEventListener('resize', update, { passive: true })
  }

  return { height, width, update, ssr: !!ssr }
}
