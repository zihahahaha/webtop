<script setup lang="ts">
import { inject, ref } from "vue";
import {
  titleKey,
  xKey,
  yKey,
  widthKey,
  heightKey,
  modeKey,
  borderKey,
} from "@/key";
const emit = defineEmits(["close", "minimize", "maximize", "windowize"]);
const title = inject(titleKey);
const x = inject(xKey);
const y = inject(yKey);
const width = inject(widthKey);
const height = inject(heightKey);
const mode = inject(modeKey);
const border = inject(borderKey);

const btnBarRef = ref();

const props = defineProps<{
  wndRef: HTMLElement;
}>();

// 用户全屏拖拽功能
function onDragStart(e: MouseEvent) {
  e.preventDefault();
  let init_x = x!.value;
  let init_y = y!.value;
  if (mode?.value == "maximum") {
    const rect = props.wndRef.getBoundingClientRect();
    // 窗口化后的标题栏内offset
    const offsetX =
      (e.offsetX / (rect.width - 2 * border!.width)) *
      (width!.value - 2 * border!.width);
    if (
      offsetX >
      width!.value - 2 * border!.width - btnBarRef.value.offsetWidth
    )
      init_x =
        e.clientX -
        rect.x -
        (width!.value - 2 * border!.width - btnBarRef.value.offsetWidth) -
        1;
    else init_x = e.clientX - rect.x - offsetX - border!.width;
    init_y = 0;
  }
  const init_mouse_x = e.pageX;
  const init_mouse_y = e.pageY;
  function onDrag(e: MouseEvent) {
    emit("windowize");
    x!.value = init_x + (e.pageX - init_mouse_x);
    y!.value = init_y + (e.pageY - init_mouse_y);
    console.log(x!.value, y!.value);
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
</script>

<template>
  <div class="titlebar" @mousedown="onDragStart" @dblclick="emit('maximize')">
    <div class="title">{{ title }}</div>
    <div style="display: flex" @mousedown.stop ref="btnBarRef">
      <div class="btn -minimize" @click="emit('minimize')"></div>
      <div class="btn --maximize" @click="emit('maximize')"></div>
      <div class="btn -close" @click="emit('close')"></div>
    </div>
  </div>
</template>

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
