// Composables
import { useResizeObserver } from '@/composables/resizeObserver'
import { useRender } from '@/composables/useRender'

// Utilities
import { defineComponent, type PropType, type StyleValue, watch } from 'vue'

export const VirtualListItem = defineComponent({
  name: 'VirtualListItem',
  inheritAttrs: false,

  props: {
    renderless: Boolean,
    class: [String, Array] as PropType<any>,
    style: {
      type: [String, Array, Object] as PropType<StyleValue>,
      default: null,
    },
  },

  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    'update:height': (height: number) => true,
  },

  setup (props, { attrs, emit, slots }) {
    const { resizeRef, contentRect } = useResizeObserver(undefined, 'border')

    watch(() => contentRect.value?.height, height => {
      if (height != null) emit('update:height', height)
    })

    useRender(() => props.renderless ? (
      <>
        { slots.default?.({ itemRef: resizeRef }) }
      </>
    ) : (
      <div
        ref={ resizeRef }
        class={[
          'v-virtual-list__item',
          props.class,
        ]}
        style={ props.style }
        { ...attrs }
      >
        { (slots.default as any)?.() }
      </div>
    ))
  },
})

export type VirtualListItem = InstanceType<typeof VirtualListItem>
