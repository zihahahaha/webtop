<script setup lang="ts">
import { ref } from "vue";
import SelectorPanel from "../SelectorPanel.vue";
const activeIndex = ref("developer mode");
import DeveloperMode from "./DeveloperMode.vue";
</script>

<template>
  <SelectorPanel
    name="系统"
    v-model:index="activeIndex"
    class="customization"
    :menuOptions="[
      {
        label: '开发者模式',
        icon: '',
        index: 'developer mode',
      },
    ]"
  >
    <DeveloperMode v-if="activeIndex === 'developer mode'" />
  </SelectorPanel>
</template>
