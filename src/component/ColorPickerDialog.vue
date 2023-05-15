<script setup lang="ts">
import Dialog from "./Dialog.vue";
import ColorPicker from "./ColorPicker";
import Button from "./Button.vue";
import { ref, watch } from "vue";
const props = defineProps<{
  color: string;
  show: boolean;
}>();
const emit = defineEmits<{
  (e: "update:color", value: string): void;
  (e: "update:show", value: boolean): void;
}>();
const color = ref(props.color);
watch(
  () => props.color,
  () => {
    color.value = props.color;
  }
);
</script>

<template>
  <Dialog
    title="选择颜色"
    :show="show"
    @update:show="(value) => emit('update:show', value)"
  >
    <div style="display: flex; margin: 5px 0 5px 5px">
      <ColorPicker v-model="color" />
      <div style="margin: 0 5px">
        <div style="margin: 5px 0">
          <Button
            @click="
              emit('update:color', color);
              emit('update:show', false);
            "
            >确定</Button
          >
        </div>
        <div><Button @click="emit('update:show', false)">取消</Button></div>
      </div>
    </div>
  </Dialog>
</template>
