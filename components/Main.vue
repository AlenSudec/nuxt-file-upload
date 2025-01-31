<template>
    <main :class="config.wrapper">
      <slot />
    </main>
  </template>
  
  <script setup >
  const config = {
    wrapper: 'min-h-[calc(100vh-var(--header-height))]'
  }
  
  defineOptions({
    inheritAttrs: false
  })
  
  const props = defineProps({
    class: {
      type: [String, Object, Array],
      default: undefined
    },

  })
  
  </script>