import 'vue/jsx'
import type { Events, VNode } from 'vue'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface IntrinsicAttributes {
      [name: string]: any
    }
  }
}

declare module '@vue/runtime-dom' {
  type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

  type Combine<T extends string> = T | {
    [K in T]: {
      [L in Exclude<T, K>]: `${K}${Exclude<T, K>}` | `${K}${L}${Exclude<T, K | L>}`
    }[Exclude<T, K>]
  }[T]

  type Modifiers = Combine<'Passive' | 'Capture' | 'Once'>

  type ModifiedEvents = UnionToIntersection<{
    [K in keyof Events]: { [L in `${K}${Modifiers}`]: Events[K] }
  }[keyof Events]>

  type EventHandlers<E> = {
    [K in keyof E]?: E[K] extends Function ? E[K] : (payload: E[K]) => void
  }

  export interface HTMLAttributes extends EventHandlers<ModifiedEvents> {
    onScrollend?: (e: Event) => void
  }

  type CustomProperties = {
    [k in `--${string}`]: any
  }

  export interface CSSProperties extends CustomProperties {}
}
