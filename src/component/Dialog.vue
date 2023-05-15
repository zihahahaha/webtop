<script setup lang="ts">
import { inject, watch, ref, watchEffect } from "vue";
import { maskRefKey, widthKey, heightKey, maskFlagKey } from "@/key";
const props = defineProps<{
  title: string;
  show: boolean;
}>();
const emit = defineEmits(["update:show"]);
const maskRef = inject(maskRefKey);
const loadFlag = ref(false);
watch(maskRef!, (value) => {
  if (value) loadFlag.value = true;
  else loadFlag.value = false;
});
const width = inject(widthKey);
const height = inject(heightKey);
const x = ref(width!.value / 2);
const y = ref(height!.value / 2);

const maskFlag = inject(maskFlagKey);
watchEffect(() => {
  maskFlag!.value = props.show;
});
function onDragStart(e: MouseEvent) {
  e.preventDefault();
  let init_x = x!.value;
  let init_y = y!.value;
  const init_mouse_x = e.pageX;
  const init_mouse_y = e.pageY;
  function onDrag(e: MouseEvent) {
    x.value = init_x + (e.pageX - init_mouse_x);
    y.value = init_y + (e.pageY - init_mouse_y);
  }
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", function xxx() {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", xxx);
  });
}
</script>

<template>
  <Teleport :to="maskRef" v-if="loadFlag && show">
    <div class="dialog" v-bind="$attrs">
      <div class="titlebar" @mousedown="onDragStart">
        <div class="title">{{ title }}</div>
        <div class="btn -close" @click="emit('update:show', false)"></div>
      </div>
      <div class="client">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog {
  position: absolute;
  background-color: #fff;
  transform: translateX(v-bind("`${x}px`")) translateY(v-bind("`${y}px`"));
  border: solid 1px gray;
  z-index: 1;
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
  padding-top: 25px;
}
</style>
