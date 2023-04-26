<script setup lang="ts">
import { ref } from "vue";
import type { MenuOption } from "./type";
defineProps<{
  menuOptions: MenuOption[];
  index: string;
}>();
const emit = defineEmits<{
  (e: "update:option", option: MenuOption): void;
}>();
</script>

<template>
  <div :class="$style.menu">
    <div
      class="option"
      :class="{ '--active': i.index === index }"
      v-for="i in menuOptions"
      @click="emit('update:option', i)"
    >
      {{ i.label }}
    </div>
  </div>
</template>

<style module>
.menu {
  overflow: auto;
}
</style>

<style scoped>
.option {
  user-select: none;
  font-size: 16px;
}
.option:hover {
  background-color: #cfcfcf;
}
.option.--active {
  background-color: #bfbfbf;
}
</style>
