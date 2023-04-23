<script setup lang="ts">
import { ref } from "vue";
import SelectorPanel from "../SelectorPanel.vue";
const activeIndex = ref("application list");
</script>

<template>
  <SelectorPanel
    v-model:index="activeIndex"
    class="customization"
    :menuOptions="[
      
    ]"
  >
    <AppList v-if="activeIndex === 'application list'" />
  </SelectorPanel>
</template>
