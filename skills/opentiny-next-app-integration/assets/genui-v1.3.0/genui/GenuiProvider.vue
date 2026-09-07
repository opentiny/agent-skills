<script setup lang="ts">
import { GenuiConfigProvider } from '@opentiny/genui-sdk-vue/config-provider'
import { materials } from '@opentiny/genui-sdk-materials-vue-opentiny-vue/materials'
</script>

<template>
  <GenuiConfigProvider id="tiny-robot-genui" :materials="materials">
    <slot />
  </GenuiConfigProvider>
</template>
