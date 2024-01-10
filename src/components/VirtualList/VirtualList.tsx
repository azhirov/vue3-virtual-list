import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  onScopeDispose,
  type PropType, type SlotsType, type StyleValue,
  toRef, withModifiers
} from 'vue'
import { convertToUnit } from '@/utils/helpers'
import { useVirtual } from '@/composables/virtual'
import { useToggleScope } from '@/composables/toggleScope'
import { getScrollParent } from '@/utils/getScrollParent'
import { useRender } from '@/composables/useRender'
import { VirtualListItem } from './VirtualListItem'

import './styles.css'

export const VirtualList = defineComponent({
  name: 'VirtualList',
  props: {
    items: {
      type: Array as PropType<any[]>,
      required: true,
    },
    renderless: Boolean,
    itemHeight: {
      type: [Number, String],
      default: undefined,
    },
    minItemHeight: {
      type: Number,
      default: 16,
    },
    height: {
      type: [Number, String],
      default: undefined,
    },
    class: [String, Array] as PropType<any>,
    style: {
      type: [String, Array, Object] as PropType<StyleValue>,
      default: null,
    },
  },
  slots: Object as SlotsType<{
    default: { item: any; index: number }
  }>,
  setup(props, { slots }) {
    const vm = getCurrentInstance();

    const heightUnit = computed(() => convertToUnit(props.height))

    const dimensionStyles = computed(() => ({
      height: heightUnit.value,
    }))

    const minItemHeightRef = toRef(props, 'minItemHeight')

    const {
      containerRef,
      markerRef,
      handleScroll,
      handleScrollend,
      handleItemResize,
      scrollToIndex,
      paddingTop,
      paddingBottom,
      computedItems,
    } = useVirtual(props, toRef(props, 'items'), minItemHeightRef)

    useToggleScope(() => props.renderless, () => {
      function handleListeners (add = false) {
        const method = add ? 'addEventListener' : 'removeEventListener'

        if (containerRef.value === document.documentElement) {
          document[method]('scroll', handleScroll, { passive: true })
          document[method]('scrollend', handleScrollend)
        } else {
          containerRef.value?.[method]('scroll', handleScroll, { passive: true })
          containerRef.value?.[method]('scrollend', handleScrollend)
        }
      }

      onMounted(() => {
        containerRef.value = getScrollParent(vm!.vnode.el as HTMLElement, true)
        handleListeners(true)
      })
      onScopeDispose(handleListeners)
    })

    useRender(() => {
      const children = computedItems.value.map(item => (
        <VirtualListItem
          key={ item.index }
          renderless={ props.renderless }
          onUpdate:height={ height => handleItemResize(item.index, height) }
        >
          { (slotProps: any) => slots.default?.({ item: item.raw, index: item.index, ...slotProps }) }
        </VirtualListItem>
      ))

      return props.renderless ? (
        <>
          <div ref={ markerRef } class="v-virtual-list__spacer" style={{ paddingTop: convertToUnit(paddingTop.value) }} />
          { children }
          <div class="v-virtual-list__spacer" style={{ paddingBottom: convertToUnit(paddingBottom.value) }} />
        </>
      ) : (
        <div
          ref={ containerRef }
          class={[
            'v-virtual-list',
            props.class,
          ]}
          onScroll={ withModifiers(handleScroll, ['passive']) }
          onScrollend={ handleScrollend }
          style={[
            dimensionStyles.value,
            props.style,
          ]}
        >
          <div
            ref={ markerRef }
            class="v-virtual-list__container"
            style={{
              paddingTop: convertToUnit(paddingTop.value),
              paddingBottom: convertToUnit(paddingBottom.value),
            }}
          >
            { children }
          </div>
        </div>
      )
    })

    return {
      scrollToIndex,
    }
  }
})

export type VirtualList = InstanceType<typeof VirtualList>
