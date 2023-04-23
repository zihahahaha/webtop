<script setup lang="ts">
import { ref } from "vue";
import { installedList } from "@/appManager";
import Button from "@/component/Button.vue";

const activeIndex = ref(-1);
</script>

<template>
  <div class="applist-panel">
    <template v-for="(i, index) in installedList">
      <div
        class="app"
        :class="{ '--selected': activeIndex === index }"
        @click="activeIndex = index"
      >
        <div class="flex-wrapper">
          <img class="application-icon" :src="i.icon" alt="" />
          <div class="content-wrapper">
            <div class="application-name">{{ i.application_name }}</div>
            <div class="register-name">注册名：{{ i.register_name }}</div>
            <div class="url">请求地址：{{ i.url }}</div>
          </div>
        </div>
        <Button v-show="activeIndex === index">删除</Button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.app:hover {
  background-color: #e6e6e6;
}
.flex-wrapper {
  display: flex;
  user-select: none;
  align-items: center;
}
.content-wrapper {
  padding-left: 10px;
}
.application-icon {
  width: 35px;
  height: 35px;
  object-fit: contain;
  background-color: #595454;
}
.app.--selected {
  background-color: #bfbfbf;
}
</style>
