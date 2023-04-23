<script setup lang="ts">
import { ref, toRef } from "vue";
import type { ActionType } from "./type";
const { action } = defineProps<{
  action: ActionType;
}>();

const checked = toRef(action, "checked");

function onClick() {
  if (checked.value !== undefined) checked.value = !checked.value;
  action.trigger?.(checked.value);
}
let disable = toRef(action, "disable");
</script>

<template>
  <div
    v-bind="$attrs"
    class="action"
    :class="{
      '--checked': checked,
      '--disable': disable,
    }"
    @click="onClick"
  >
    {{ action.label }}
  </div>
  <div class="hr" v-if="action.hr"></div>
</template>

<style scoped>
.action {
  position: relative;
  background-color: #eeeeee;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 15px;
  user-select: none;
  padding-left: 20px;
  padding-right: 70px;
  margin: 4px 0;
}

.action:hover {
  background-color: #fff;
}
.--checked::before {
  display: block;
  position: absolute;
  content: "√";
  left: 5px;
}
.--selected::before {
  display: block;
  position: absolute;
  content: "-";
  left: 5px;
}
.--disable {
  pointer-events: none;
  opacity: 0.75;
}
.hr {
  margin: 0 8px;
  height: 0;
  box-shadow: 0 0 0 1px #919191;
}
</style>
