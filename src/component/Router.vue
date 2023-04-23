<script setup lang="ts">
import { ref, watch } from "vue";
const props = withDefaults(
  defineProps<{
    index: string;
    max?: number;
  }>(),
  {
    max: 10,
  }
);
const emit = defineEmits(["update:index"]);
const history: string[] = [];
watch(
  () => props.index,
  (value, oldValue) => {
    if (value === history[history.length - 1]) history.pop();
    else {
      if (history.length < props.max && oldValue) {
        history.push(oldValue);
      } else {
        for (let i = 0; i < history.length - 1; ++i) {
          history[i] = history[i + 1];
        }
        history[props.max - 1] = oldValue;
      }
    }
  }
);
function back() {
  if (history.length != 0) emit("update:index", history[history.length - 1]);
}
defineExpose({
  back,
});
</script>

<template>
  <slot />
</template>
