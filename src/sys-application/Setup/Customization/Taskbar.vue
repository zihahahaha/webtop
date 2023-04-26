<script setup lang="ts">
import { ref } from "vue";
import { desktopState } from "@/store";
import Selector from "@/component/Selector.vue";
import { NSwitch, NConfigProvider } from "naive-ui";
</script>

<template>
  <div class="taskbar">
    <div class="p">锁定任务栏</div>
    <NConfigProvider preflight-style-disabled>
      <NSwitch v-model:value="desktopState.taskbarLock" size="small" />
      <div class="label">{{ desktopState.taskbarLock ? "是" : "否" }}</div>
    </NConfigProvider>
    <div class="p">任务栏在桌面位置</div>
    <Selector
      :style="{ width: '300px' }"
      v-model:index="desktopState.taskbarPos"
      :selectorOptions="[
        {
          label: '顶部',
          index: 'top',
        },
        {
          label: '底部',
          index: 'bottom',
        },
        {
          label: '靠左',
          index: 'left',
        },
        {
          label: '靠右',
          index: 'right',
        },
      ]"
    ></Selector>
  </div>
</template>

<style src="../common.css" scoped></style>
