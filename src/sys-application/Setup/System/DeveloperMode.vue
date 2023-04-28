<script setup lang="ts">
import { developerMode } from "@/global";
import Selector from "@/component/Selector.vue";
import { NSwitch, NConfigProvider } from "naive-ui";
</script>

<template>
  <div class="taskbar">
    <div class="p">布局边界</div>
    <NConfigProvider preflight-style-disabled>
      <NSwitch v-model:value="developerMode.boundary" size="small" />
    </NConfigProvider>
  </div>
</template>

<style src="../common.css" scoped></style>
