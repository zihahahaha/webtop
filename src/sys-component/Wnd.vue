<script setup lang="ts">
import {
  toRef,
  ref,
  resolveComponent,
  provide,
  computed,
  watch,
  watchEffect,
} from "vue";
import type { InjectionKey, Ref } from "vue";
import {
  maskFlag as desktopMaskFlag,
  width as desktopWidth,
  height as desktopHeight,
} from "@/global";
import type { WndBase } from "@/type";
import { desktopState } from "@/store";

const { wnd } = defineProps<{
  wnd: WndBase;
}>();

const borderWidth = computed(() => {
  if (wnd.border.flag) return wnd.border.width;
  else return 0;
});

// 可读写
provide("width", toRef(wnd, "width"));
provide("height", toRef(wnd, "height"));
provide("x", toRef(wnd, "x"));
provide("y", toRef(wnd, "y"));
provide("title", toRef(wnd, "title"));
provide("icon", toRef(wnd, "icon"));
provide("titleBar", wnd.titleBar);
provide("border", wnd.border);
provide("mode", toRef(wnd, "mode"));
const maskFlag = ref(false);
provide("maskFlag", maskFlag);

// 只读
provide("init", wnd.init);
const readonlyWidth = ref(wnd.width);
const readonlyHeight = ref(wnd.height);
watchEffect(() => {
  if (wnd.mode === "maximum") {
    readonlyWidth.value = desktopWidth.value;
    readonlyHeight.value = desktopWidth.value;
  } else if (wnd.mode === "windowed") {
    readonlyWidth.value = wnd.width;
    readonlyHeight.value = wnd.height;
  }
});
provide("readonlyWidth", readonlyWidth);
provide("readonlyHeight", readonlyHeight);

// 方法
function close() {
  emit("close");
}
function maximize() {
  emit("maximize");
}
function minimize() {
  emit("minimize");
}
function windowize() {
  emit("windowize");
}
provide("close", close);
provide("maximize", maximize);
provide("minimize", minimize);
provide("windowize", windowize);

//Ref
const maskRef = ref();
provide("maskRef", maskRef);

const emit = defineEmits(["minimize", "maximize", "close", "windowize"]);
const Client = resolveComponent(wnd.aid);
const wndRef = ref();
const btnBarRef = ref();

const minWidth = 100;
const minHeight = 0;

// 用户全屏拖拽功能
function onDragStart(e: MouseEvent) {
  e.preventDefault();
  let init_x = wnd.x;
  let init_y = wnd.y;
  if (wnd.mode == "maximum") {
    const rect = (wndRef.value as HTMLElement).getBoundingClientRect();
    // 窗口化后的标题栏内offset
    const offsetX =
      (e.offsetX / (rect.width - 2 * borderWidth.value)) *
      (wnd.width - 2 * borderWidth.value);
    if (
      offsetX >
      wnd.width - 2 * borderWidth.value - btnBarRef.value.offsetWidth
    )
      init_x =
        e.clientX -
        rect.x -
        (wnd.width - 2 * borderWidth.value - btnBarRef.value.offsetWidth) -
        1;
    else init_x = Math.floor(e.clientX - rect.x - offsetX - borderWidth.value);
    init_y = 0;
  }
  const init_mouse_x = e.pageX;
  const init_mouse_y = e.pageY;
  function onDrag(e: MouseEvent) {
    emit("windowize");
    wnd.x = init_x + (e.pageX - init_mouse_x);
    wnd.y = init_y + (e.pageY - init_mouse_y);
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}

// 用户尺寸调整
function dragTop(init_mouse_y: number, init_height: number, init_y: number) {
  return function (e: MouseEvent) {
    const calcHeight = init_height + (init_mouse_y - e.pageY);

    if (calcHeight < minHeight) {
      wnd.height = minHeight;
      wnd.y = init_y - (init_mouse_y - e.pageY) - (minHeight - calcHeight);
    } else {
      wnd.height = calcHeight;
      wnd.y = init_y - (init_mouse_y - e.pageY);
    }
  };
}
function dragBottom(init_mouse_y: number, init_height: number) {
  return function (e: MouseEvent) {
    const calcHeight = init_height - (init_mouse_y - e.pageY);
    if (calcHeight < minHeight) {
      wnd.height = minHeight;
    } else {
      wnd.height = calcHeight;
    }
  };
}
function dragLeft(init_mouse_x: number, init_width: number, init_x: number) {
  return function (e: MouseEvent) {
    const calcWidth = init_width + (init_mouse_x - e.pageX);
    if (calcWidth < minWidth) {
      wnd.width = minWidth;
      wnd.x = init_x - (init_mouse_x - e.pageX) - (minWidth - calcWidth);
    } else {
      wnd.width = calcWidth;
      wnd.x = init_x - (init_mouse_x - e.pageX);
    }
  };
}
function dragRight(init_mouse_x: number, init_width: number) {
  return function (e: MouseEvent) {
    const calcWidth = init_width - (init_mouse_x - e.pageX);
    if (calcWidth < minWidth) {
      wnd.width = minWidth;
    } else {
      wnd.width = calcWidth;
    }
  };
}
function onResizeTop(e: MouseEvent) {
  e.preventDefault();
  desktopMaskFlag.value = true;
  let onDrag = dragTop(e.pageY, wnd.height, wnd.y);
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    desktopMaskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
function onResizeBottom(e: MouseEvent) {
  e.preventDefault();
  desktopMaskFlag.value = true;
  let onDrag = dragBottom(e.pageY, wnd.height);
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    desktopMaskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
function onResizeLeft(e: MouseEvent) {
  e.preventDefault();
  desktopMaskFlag.value = true;
  let onDrag = dragLeft(e.pageX, wnd.width, wnd.x);
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    desktopMaskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mousedown", xxx);
  });
}
function onResizeRight(e: MouseEvent) {
  e.preventDefault();
  desktopMaskFlag.value = true;
  let onDrag = dragRight(e.pageX, wnd.width);
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    desktopMaskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mousedown", xxx);
  });
}
function onResizeTL(e: MouseEvent) {
  e.preventDefault();
  desktopMaskFlag.value = true;
  let T = dragTop(e.pageY, wnd.height, wnd.y);
  let L = dragLeft(e.pageX, wnd.width, wnd.x);
  function onDrag(e: MouseEvent) {
    T(e);
    L(e);
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    desktopMaskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
function onResizeTR(e: MouseEvent) {
  e.preventDefault();
  desktopMaskFlag.value = true;
  let T = dragTop(e.pageY, wnd.height, wnd.y);
  let R = dragRight(e.pageX, wnd.width);
  function onDrag(e: MouseEvent) {
    T(e);
    R(e);
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    desktopMaskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
function onResizeBL(e: MouseEvent) {
  e.preventDefault();
  desktopMaskFlag.value = true;
  let B = dragBottom(e.pageY, wnd.height);
  let L = dragLeft(e.pageX, wnd.width, wnd.x);
  function onDrag(e: MouseEvent) {
    B(e);
    L(e);
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    desktopMaskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
function onResizeBR(e: MouseEvent) {
  e.preventDefault();
  desktopMaskFlag.value = true;
  let B = dragBottom(e.pageY, wnd.height);
  let R = dragRight(e.pageX, wnd.width);
  function onDrag(e: MouseEvent) {
    B(e);
    R(e);
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    desktopMaskFlag.value = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
</script>

<template>
  <div
    class="wnd"
    :class="`--${wnd.mode}`"
    ref="wndRef"
    @contextmenu.stop.prevent
  >
    <div class="controlborder">
      <div class="border-l" @mousedown="onResizeLeft"></div>
      <div class="border-r" @mousedown="onResizeRight"></div>
      <div class="border-t" @mousedown="onResizeTop"></div>
      <div class="border-b" @mousedown="onResizeBottom"></div>
      <div class="border-tl" @mousedown="onResizeTL"></div>
      <div class="border-tr" @mousedown="onResizeTR"></div>
      <div class="border-bl" @mousedown="onResizeBL"></div>
      <div class="border-br" @mousedown="onResizeBR"></div>
    </div>
    <div
      v-if="wnd.titleBar.flag"
      class="titlebar"
      @mousedown="onDragStart"
      @dblclick="emit('maximize')"
    >
      <div class="title">{{ wnd.title }}</div>
      <div style="display: flex" @mousedown.stop ref="btnBarRef">
        <div class="btn -minimize" @click="emit('minimize')"></div>
        <div class="btn --maximize" @click="emit('maximize')"></div>
        <div class="btn -close" @click="emit('close')"></div>
      </div>
    </div>
    <div class="client">
      <Client />
    </div>
    <div class="mask" v-if="maskFlag" ref="maskRef"></div>
  </div>
</template>

<style scoped>
.wnd {
  --wnd: #71ff71;
  --control-border: #7f7f7f;
  --control-vertex: #ff7f7f;
  --titlebar: #00a6ff;
  --client: #fff23fd1;
}
.wnd {
  position: absolute;
  background-color: var(--wnd);
  pointer-events: auto;
  border-style: solid;
  border-width: v-bind("`${borderWidth}px`");
  border-color: black;
  box-sizing: border-box;
}
.--windowed {
  transform: translateX(v-bind("`${wnd.x}px`"))
    translateY(v-bind("`${wnd.y}px`"));

  width: v-bind("`${wnd.width}px`");
  height: v-bind("`${wnd.height}px`");
}
.--maximum {
  left: v-bind("`${-borderWidth}px`");
  top: v-bind("`${-borderWidth}px`");
  width: calc(100% + v-bind("`${2* borderWidth}px`"));
  height: calc(100% + v-bind("`${2* borderWidth}px`"));
}
.--minimum {
  display: none;
}
</style>

<style scoped>
.controlborder {
  position: absolute;
  left: calc(-7px - v-bind("`${borderWidth}px`"));
  top: calc(-7px - v-bind("`${borderWidth}px`"));
  width: calc(100% + v-bind("`${2* borderWidth}px`"));
  height: calc(100% + v-bind("`${2 * borderWidth}px`"));
  padding: 7px;
  background-color: var(--wnd);
}

.border-t {
  position: absolute;
  left: 14px;
  top: 0;
  width: calc(100% - 28px);
  height: 7px;
  cursor: n-resize;
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

.border-l {
  position: absolute;
  left: 0;
  top: 7px;
  width: 7px;
  height: calc(100% - 14px);
  cursor: w-resize;
  background-color: var(--control-border);
}

.border-b {
  position: absolute;
  left: 14px;
  bottom: 0;
  width: calc(100% - 28px);
  height: 7px;
  cursor: s-resize;
  background-color: var(--control-border);
}

.border-tl {
  position: absolute;
  left: 0;
  top: 0;
  width: 14px;
  height: 7px;
  cursor: nw-resize;
  background-color: var(--control-vertex);
}

.border-tr {
  position: absolute;
  right: 0;
  top: 0;
  width: 14px;
  height: 7px;
  cursor: ne-resize;
  background-color: var(--control-vertex);
}

.border-bl {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 14px;
  height: 7px;
  cursor: ne-resize;
  background-color: var(--control-vertex);
}

.border-br {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 14px;
  height: 7px;
  cursor: nw-resize;
  background-color: var(--control-vertex);
}
</style>

<style scoped>
.titlebar {
  display: flex;
  position: absolute;
  top: 0;
  width: 100%;
  height: 25px;
  user-select: none;
  background-color: var(--titlebar);
}
.title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 25px;
}
.btn {
  width: 17px;
  height: 17px;
  margin: 4px 7px;
  background-color: black;
}
</style>

<style scoped>
.client {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: calc(100% - v-bind("`${25 * Number(wnd.titleBar.flag) }px`"));
  background-color: var(--client);
}
.mask {
  position: absolute;
  left: calc(-7px - v-bind("`${borderWidth}px`"));
  top: calc(-7px - v-bind("`${borderWidth}px`"));
  width: calc(100% + v-bind("`${2* borderWidth}px`") + 14px);
  height: calc(100% + v-bind("`${2 * borderWidth}px`") + 14px);
  z-index: 1;
}
</style>
