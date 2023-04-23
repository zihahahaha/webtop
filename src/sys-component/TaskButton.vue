<script setup lang="ts">
import type { Task } from "@/type";
import { desktopState } from "@/store";
const props = defineProps<{
  task: Task;
}>();
const icon = props.task.icon;
</script>

<template>
  <div class="task-button" :class="`--${desktopState.taskbarPos}`">
    <img draggable="false" :src="icon" alt="" class="icon" />
    <div class="title">{{ task.title }}</div>
  </div>
</template>

<style scoped>
.task-button {
  box-sizing: border-box;
  height: 30px;
  border: solid 1px black;
  display: flex;
  background-color: rgb(100, 255, 140);
  user-select: none;
  overflow: hidden;
}

.icon {
  display: block;
  padding: 6px;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.title {
  font-size: 14px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.--left,
.--right {
  width: 100%;
  min-width: 30px;
}

.--top,
.--bottom {
  width: 140px;
  min-width: 100px;
}
</style>
