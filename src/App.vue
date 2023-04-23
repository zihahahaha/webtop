<script setup lang="ts">
import { desktopState } from "@/store";
import { ref, toRef } from "vue";
import { __wndManager, __wnds, __tasks } from "@/wndManager";
import { maskFlag, loading } from "@/global";
import LinkPanel from "./sys-component/LinkPanel.vue";
import Taskbar from "./sys-component/Taskbar.vue";
import Wnd from "@/sys-component/Wnd.vue";
import TaskButton from "@/sys-component/TaskButton.vue";
import ContextMenu from "@/component/ContextMenu";

const width = toRef(desktopState, "width");
const height = toRef(desktopState, "height");

// 任务栏
function onClick(index: number) {
  __wndManager.__restoreMinSavedMode(index);
}

// 窗口
function onMinimize(index: number) {
  __wndManager.__minimize(index);
}
function onMaximize(index: number) {
  __wndManager.__wOrMaximize(index);
}
function onClose(index: number) {
  __wndManager.__remove(index);
}
function onWindowize(index: number) {
  __wndManager.__windowimize(index);
}
function onMouseDown(index: number) {
  __wndManager.__active(index);
}

// 任务按钮contextMenu
const taskContextIndex = ref(-1);
const taskMenu = [
  {
    label: "关闭",
    trigger: function () {
      __wndManager.__remove(taskContextIndex.value);
    },
  },
];
const event = ref();
function onTaskContextMenu(e: MouseEvent, index: number) {
  event.value = e;
  taskContextIndex.value = index;
}
</script>

<template>
  <Unit>
    <button @click="desktopState.mode = 'fixed'">FXIED</button>
    <button @click="desktopState.mode = 'auto'">AUTO</button>
  </Unit>
  <div
    class="desktop"
    :class="[`--${desktopState.mode}`, { '--loading': loading }]"
  >
    <div class="mask" v-if="maskFlag"></div>
    <LinkPanel>
      <Wnd
        v-for="(i, index) in __wnds"
        :key="i.wid"
        :style="{ 'z-index': i['z-index'] }"
        :wnd="i"
        @mousedown="onMouseDown(index)"
        @minimize="onMinimize(index)"
        @maximize="onMaximize(index)"
        @close="onClose(index)"
        @windowize="onWindowize(index)"
      />
    </LinkPanel>
    <Taskbar>
      <TaskButton
        v-for="(i, index) in __tasks"
        :task="i"
        @click="onClick(index)"
        @contextmenu.prevent.stop="onTaskContextMenu($event, index)"
      />
    </Taskbar>
    <ContextMenu :menus="taskMenu" :e="event" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
}

.desktop {
  position: absolute;
  overflow: hidden;
}

.--fixed {
  width: v-bind("`${width}px`");
  height: v-bind("`${height}px`");
}

.--auto {
  width: 100%;
  height: 100vh;
}
.--loading::after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: gray;
  opacity: 0.3;
  z-index: 999;
}
</style>
