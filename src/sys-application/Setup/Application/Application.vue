<script setup lang="ts">
import { ref } from "vue";
import SelectorPanel from "../SelectorPanel.vue";
import AppList from "./AppList.vue";
const activeIndex = ref("application list");
</script>

<template>
  <SelectorPanel
    name="应用"
    v-model:index="activeIndex"
    class="customization"
    :menuOptions="[
      {
        label: '应用列表',
        icon: '',
        index: 'application list',
      },
    ]"
  >
    <AppList v-if="activeIndex === 'application list'" />
  </SelectorPanel>
</template>

<style scoped></style>
