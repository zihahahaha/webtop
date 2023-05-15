<script setup lang="ts">
import ColorPickerDialog from "@/component/ColorPickerDialog.vue";
import Button from "@/component/Button.vue";
import { ref } from "vue";

const color = ref("rgba(0,255,255,100%)");
const colorPickerShow = ref(false);
</script>

<template>
  <div class="themecolor-panel">
    <div class="p">选择主题色</div>
    <Button @click="colorPickerShow = true">自定义主题色</Button>
    <ColorPickerDialog v-model:color="color" v-model:show="colorPickerShow" />
    <div>{{ color }}</div>
  </div>
</template>
