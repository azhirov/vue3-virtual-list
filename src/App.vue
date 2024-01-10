<script setup lang="ts">
import { ref } from 'vue'
import { VirtualList } from './components/VirtualList'

const items = ref([1,2,3,4,5,6,7,8,9,10])

for (let i = 0; i < 100; i += 1) {
  items.value.push(i);
}
</script>

<template>
  <virtual-list :items="items">
    <template #default="{item}">
      <div>{{ JSON.stringify(item) }}</div>
    </template>
  </virtual-list>
</template>

<style scoped>
.v-virtual-list {
  height: 400px;
}
</style>
