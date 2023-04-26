<script setup lang="ts">
import type { ActionType } from "./type";
import { ref } from "vue";
import Action from "./Action.vue";
const props = defineProps<{
  actions: ActionType[];
}>();
const emit = defineEmits(["close"]);
const activeIndex = ref(props.actions.findIndex((i) => i.selected === true));

function onClick(index: number) {
  emit("close");
  activeIndex.value = index;
}
function isSelected(index: number, i: ActionType) {
  if (typeof i.selected === "object") return i.selected.value;
  else if (index === activeIndex.value) return true;
  else return false;
}
</script>

<template>
  <Action
    v-for="(i, index) in actions"
    :class="{ '--selected': isSelected(index, i) }"
    :action="i"
    @click="onClick(index)"
  />
</template>
