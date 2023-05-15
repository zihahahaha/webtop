<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
defineProps<{
  modelValue: any;
}>();
const emit = defineEmits<{
  (e: "validate", value: string, prevent: Function): void;
  (e: "update:modelValue", value: string): void;
}>();
const input: Ref<HTMLInputElement | undefined> = ref();
function validate(e: InputEvent) {
  let value = input.value!.value;
  if (e.data) value = value + e.data;
  else value = value.slice(0, -1);
  emit("validate", value, () => e.preventDefault());
}
</script>

<template>
  <input
    class="input"
    type="text"
    @beforeinput="validate"
    @input="emit('update:modelValue', input!.value)"
    :value="modelValue"
    ref="input"
  />
</template>

<style scoped>
.input {
  border: solid 2px #5c5c5c;
  outline: none;
}
.input:focus {
  border: solid 2px #3f3f3f;
}
</style>
