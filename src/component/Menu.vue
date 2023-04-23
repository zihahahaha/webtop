<script setup lang="ts">
import { ref } from "vue";
import type { MenuOption }  from "./type"
defineProps<{
  menuOptions: MenuOption[];
  index: string;
}>();
const emit = defineEmits(["update:index"]);
const activeIndex = ref("");
</script>

<template>
  <div class="menu">
    <div
      class="option"
      :class="{ '--active': i.index === index }"
      v-for="i in menuOptions"
      @click="emit('update:index', i.index)"
    >
      {{ i.label }}
    </div>
  </div>
</template>

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
