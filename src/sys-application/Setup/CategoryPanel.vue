<script setup lang="ts">
import { widthKey } from "@/key";
import { inject, watch, ref } from "vue";

const width = inject(widthKey);
const gridFlag = ref(true);
watch(
  width!,
  () => {
    if (width!.value > 700) gridFlag.value = true;
    else gridFlag.value = false;
  },
  { immediate: true }
);

interface categoryoption {
  index: string;
  label: string;
}
defineProps<{
  options: categoryoption[];
  index: string;
}>();
const emit = defineEmits(["update:index"]);
</script>

<template>
  <div class="category-panel" :class="{ '--grid': gridFlag }">
    <div
      class="category"
      v-for="i in options"
      @click="emit('update:index', i.index)"
    >
      {{ i.label }}
    </div>
  </div>
</template>

<style scoped>
.category-panel {
  box-sizing: border-box;
  padding-top: 25px;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 220px);
  grid-template-rows: repeat(auto-fill, 80px);
  gap: 10px;
  justify-content: center;
}
</style>
<style scoped>
.category {
  width: 100%;
  height: 70px;
  background-color: white;
}
.--grid .category {
  height: 80px;
  width: 220px;
}
.category:hover {
  background-color: #e6e6e6;
}
</style>
