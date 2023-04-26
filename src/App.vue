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

// 窗口逻辑
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

// 任务按钮逻辑
function onClick(index: number) {
  __wndManager.__restoreMinSavedMode(index);
}

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

// 控制盒子
const sizeMessageFlag = ref(false);
const minWidth = 0;
const minHeight = 0;
function dragBottom(init_mouse_y: number, init_height: number) {
  return function (e: MouseEvent) {
    const calcHeight = init_height - (init_mouse_y - e.pageY);
    if (calcHeight < minHeight) height.value = minHeight;
    else height.value = calcHeight;
  };
}
function dragRight(init_mouse_x: number, init_width: number) {
  return function (e: MouseEvent) {
    const calcWidth = init_width - (init_mouse_x - e.pageX);
    if (calcWidth < minWidth) width.value = minWidth;
    else width.value = calcWidth;
  };
}
function onResizeBR(e: MouseEvent) {
  e.preventDefault();
  maskFlag.value = true;
  let B = dragBottom(e.pageY, height.value);
  let R = dragRight(e.pageX, width.value);
  let timerId: number | undefined = undefined;
  function onDrag(e: MouseEvent) {
    sizeMessageFlag.value = true;
    clearTimeout(timerId);
    timerId = setTimeout(() => (sizeMessageFlag.value = false), 400);
    B(e);
    R(e);
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    maskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
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
    <div class="size-message" v-if="sizeMessageFlag">
      {{ desktopState.width }} * {{ desktopState.height }}
    </div>
    <div
      class="controlvertex"
      @mousedown="onResizeBR"
      v-if="!desktopState.locked"
    ></div>
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

<style scoped>
.size-message {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.8);
}
.controlvertex {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 15px;
  height: 15px;
  background-color: red;
  z-index: 2;
  clip-path: polygon(0 100%, 100% 100%, 100% 0);
  cursor: nw-resize;
}
</style>
