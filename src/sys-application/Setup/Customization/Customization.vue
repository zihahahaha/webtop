<script setup lang="ts">
import { ref } from "vue";
import SelectorPanel from "../SelectorPanel.vue";
import Background from "./Background.vue";
import Taskbar from "./Taskbar.vue";
import Desktop from "./Desktop.vue";
const activeIndex = ref("background");
</script>

<template>
  <SelectorPanel
    name="个性化"
    v-model:index="activeIndex"
    class="customization"
    :menuOptions="[
      {
        label: '背景',
        icon: '',
        index: 'background',
      },
      {
        label: '任务栏',
        icon: '',
        index: 'taskbar',
      },
      {
        label: '桌面',
        icon: '',
        index: 'desktop',
      },
    ]"
  >
    <Background v-if="activeIndex === 'background'" />
    <Taskbar v-if="activeIndex === 'taskbar'" />
    <Desktop v-if="activeIndex === 'desktop'" />
  </SelectorPanel>
</template>

<style scoped>
.menu {
  padding-top: 25px;
  width: 300px;
  height: 100%;
  background-color: #e6e6e6;
}
.panel {
  box-sizing: border-box;
  padding-top: 25px;
  padding-left: 15px;
  flex: 1;
}
</style>
