<script setup lang="ts">
import { toRef, watch, ref } from "vue";
import { desktopState } from "@/store";
import { maskFlag } from "@/global";
import ContextMenu from "@/component/ContextMenu";
const length = toRef(desktopState, "taskbarLength");
const mode = toRef(desktopState, "taskbarPos");
watch(mode, () => {
  if (mode.value == "left" || mode.value == "right") {
    if (length.value > desktopState.width / 2)
      length.value = desktopState.width / 2;
  }
  if (mode.value == "top" || mode.value == "bottom") {
    if (length.value > desktopState.height / 2)
      length.value = desktopState.height / 2;
  }
});
// 任务栏拖拽
function onResizeTop(e: MouseEvent) {
  e.preventDefault();
  maskFlag.value = true;
  const init_height = length.value;
  const init_mouse_y = e.pageY;
  function onDrag(e: MouseEvent) {
    const calcHeight = init_height + (init_mouse_y - e.pageY);
    if (calcHeight < 30) length.value = 30;
    else if (calcHeight > desktopState.height / 2)
      length.value = desktopState.height / 2;
    else length.value = calcHeight;
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    maskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
function onResizeBottom(e: MouseEvent) {
  e.preventDefault();
  maskFlag.value = true;
  const init_mouse_y = e.pageY;
  const init_height = length.value;
  function onDrag(e: MouseEvent) {
    const calcHeight = init_height - (init_mouse_y - e.pageY);
    if (calcHeight < 30) length.value = 30;
    else if (calcHeight > desktopState.height / 2)
      length.value = desktopState.height / 2;
    else length.value = calcHeight;
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    maskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
function onResizeLeft(e: MouseEvent) {
  e.preventDefault();
  maskFlag.value = true;
  const init_mouse_x = e.pageX;
  const init_width = length.value;
  function onDrag(e: MouseEvent) {
    const calcWidth = init_width - (e.pageX - init_mouse_x);
    if (calcWidth < 30) length.value = 30;
    else if (calcWidth > desktopState.width / 2)
      length.value = desktopState.width / 2;
    else length.value = calcWidth;
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    maskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
function onResizeRight(e: MouseEvent) {
  e.preventDefault();
  maskFlag.value = true;
  const init_mouse_x = e.pageX;
  const init_width = length.value;
  function onDrag(e: MouseEvent) {
    const calcWidth = init_width + (e.pageX - init_mouse_x);
    if (calcWidth < 30) length.value = 30;
    else if (calcWidth > desktopState.width / 2)
      length.value = desktopState.width / 2;
    else length.value = calcWidth;
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    maskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}

// contextMenu
const event = ref();
const taskbarMenu = [
  {
    label: "锁定任务栏",
    checked: toRef(desktopState, "taskbarLock"),
  },
];

//Test
function onClick(pos: typeof desktopState.taskbarPos) {
  mode.value = pos;
}
</script>

<template>
  <div
    class="taskbar"
    :class="`--${mode}`"
    @contextmenu.prevent="event = $event"
  >
    <div
      class="controlborder"
      :class="{ '--locked': desktopState.taskbarLock }"
    >
      <div class="border-t" @mousedown="onResizeTop"></div>
      <div class="border-b" @mousedown="onResizeBottom"></div>
      <div class="border-l" @mousedown="onResizeLeft"></div>
      <div class="border-r" @mousedown="onResizeRight"></div>
    </div>
    <div class="task-list" :class="`list--${mode}`">
      <slot />
    </div>
    <ContextMenu :e="event" :menus="taskbarMenu" />
  </div>
</template>

<style scoped>
.taskbar {
  --taskbar: #262626;
  --control-border: #7f7f7f;
}

.taskbar {
  position: absolute;
  background-color: var(--taskbar);
  z-index: 1;
}

.--top {
  left: 0;
  top: 0;
  height: v-bind("`${length}px`");
  width: 100%;
}

.--bottom {
  left: 0;
  bottom: 0;
  height: v-bind("`${length}px`");
  width: 100%;
}

.--left {
  left: 0;
  top: 0;
  width: v-bind("`${length}px`");
  height: 100%;
}

.--right {
  right: 0;
  top: 0;
  width: v-bind("`${length}px`");
  height: 100%;
}

.task-list {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
}

.list--top,
.list--bottom {
  align-content: flex-start;
  flex-wrap: wrap;
}

.list--left,
.list--right {
  flex-direction: column;
}
</style>

<style scoped>
.controlborder {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 7px;
  left: -7px;
  top: -7px;
  background-color: var(--taskbar);
}

.border-l {
  position: absolute;
  left: 0;
  top: 7px;
  width: 7px;
  height: calc(100% - 14px);
  cursor: w-resize;
  background-color: var(--control-border);
}

.border-t {
  position: absolute;
  left: 7px;
  top: 0;
  width: calc(100% - 14px);
  height: 7px;
  cursor: n-resize;
  background-color: var(--control-border);
}

.border-b {
  position: absolute;
  left: 7px;
  bottom: 0;
  width: calc(100% - 14px);
  height: 7px;
  cursor: s-resize;
  background-color: var(--control-border);
}

.border-l {
  position: absolute;
  left: 0;
  top: 7px;
  width: 7px;
  height: calc(100% - 14px);
  cursor: w-resize;
  background-color: var(--control-border);
}

.border-r {
  position: absolute;
  right: 0;
  top: 7px;
  width: 7px;
  height: calc(100% - 14px);
  cursor: e-resize;
  background-color: var(--control-border);
}
.--locked {
  pointer-events: none;
}
</style>
