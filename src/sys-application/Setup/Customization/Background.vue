<script setup lang="ts">
import { ref } from "vue";
import { desktopState } from "@/store";
import Selector from "@/component/Selector.vue";
import Button from "@/component/Button.vue";
import ImgPicker from "@/component/ImgPicker.vue";

//图片背景
const imgPickerShow = ref(false);
</script>

<template>
  <div class="background-panel">
    <div class="p">背景类型</div>
    <Selector
      :style="{ width: '300px' }"
      v-model:index="desktopState.backgroundType"
      :selectorOptions="[
        {
          label: '图片',
          index: 'image',
        },
        {
          label: '纯色',
          index: 'color',
        },
      ]"
    />
    <div v-if="desktopState.backgroundType === 'image'">
      <div class="p">选择图片</div>
      <Button @click="imgPickerShow = true">浏览</Button>
      <ImgPicker
        v-model:img="desktopState.backgroundImage.value"
        v-model:show="imgPickerShow"
      />
      <div class="p">图片尺寸</div>
      <Selector
        :style="{ width: '300px' }"
        v-model:index="desktopState.backgroundImage.size"
        :selectorOptions="[
          {
            label: '拉伸',
            index: 'cover',
          },
          {
            label: '适应',
            index: 'contain',
          },
        ]"
      />
    </div>
  </div>
</template>

<style src="../common.css" scoped></style>
<style scoped>
.background-panel {
  height: 100%;
  overflow: auto;
}
</style>
