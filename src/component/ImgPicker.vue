<script setup lang="ts">
import { reactive, ref } from "vue";
import { desktopState } from "@/store";
import Dialog from "./Dialog.vue";
const defaultImgs = reactive(["/bgc1.jpg", "/bgc2.jpg"]);
const imgs = reactive(["/bgc1.jpg", "/bgc2.jpg"]);
defineProps<{
  img: string;
  show: boolean;
}>();
const emit = defineEmits(["update:img", "update:show"]);
</script>

<template>
  <Dialog
    title="选择背景图片"
    :show="show"
    @update:show="(value) => emit('update:show', value)"
    style="width: 300px; height: 200px"
  >
    <img
      v-for="i in imgs"
      :src="i"
      alt=""
      @click="
        emit('update:img', i);
        emit('update:show', false);
      "
    />
  </Dialog>
  <div class="img-picker">
    <img
      v-for="i in defaultImgs"
      :src="i"
      alt=""
      @click="emit('update:img', i)"
    />
  </div>
</template>

<style scoped>
.img-picker {
  display: flex;
}
img {
  width: 70px;
  height: 70px;
  object-fit: contain;
}
</style>
