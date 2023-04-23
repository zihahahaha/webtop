<script setup lang="ts">
import { computed, ref } from "vue";
interface SelectorOption {
  label: string;
  index: string;
}
const props = defineProps<{
  selectorOptions: SelectorOption[];
  index: string;
}>();
const selected = computed(() => {
  for (let i = 0; i < props.selectorOptions.length; ++i) {
    if (props.selectorOptions[i].index === props.index) {
      return props.selectorOptions[i].label;
    }
  }
  return "";
});
const emit = defineEmits(["update:index"]);
const showFlag = ref(false);
function onClick(i: SelectorOption) {
  emit("update:index", i.index);
  showFlag.value = false;
}
window.addEventListener("mousedown", () => {
  showFlag.value = false;
});
</script>

<template>
  <div class="selector">
    <div class="selected-option" @click="showFlag = !showFlag" @mousedown.stop>
      {{ selected }}
    </div>
    <div class="select-menu" v-if="showFlag" @mousedown.stop>
      <div
        class="selector-option"
        :class="{ '--selected': i.index === index }"
        v-for="i in selectorOptions"
        @click="onClick(i)"
      >
        {{ i.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.selector {
  position: relative;
}
.selected-option {
  user-select: none;
  border: solid 1px gray;
  padding-left: 10px;
}
.selector-option {
  user-select: none;
  padding-left: 10px;
}
.selector-option:hover {
  background-color: #ddd;
}
.select-menu {
  position: absolute;
  top: calc(100% + 5px);
  width: 100%;
  background-color: #f2f2f2;
  border: solid 1px gray;
  z-index: 1;
}
.selector-option.--selected {
  background-color: #bbb;
}
</style>
