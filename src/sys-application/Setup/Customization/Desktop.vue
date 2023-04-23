<script setup lang="ts">
import { ref } from "vue";
import { desktopState } from "@/store";
import Selector from "@/component/Selector.vue";
</script>

<template>
  <div class="desktop-panel">
    <div class="h">桌面</div>
    <div class="p">桌面模式</div>
    <Selector
      :style="{ width: '300px' }"
      v-model:index="desktopState.mode"
      :selectorOptions="[
        {
          label: '固定',
          index: 'fixed',
        },
        {
          label: '自动',
          index: 'auto',
        },
      ]"
    />
    <div v-if="desktopState.mode === 'fixed'">
      <div class="p">桌面解析度</div>
      <input type="text" v-model="desktopState.width" />
      <span>*</span>
      <input type="text" v-model="desktopState.height" />
    </div>
  </div>
</template>

<style src="../common.css" scoped></style>
