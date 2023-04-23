<script setup lang="ts">
import { inject } from "vue";
import { initKey } from "@/key";
const init = inject(initKey);
</script>

<template>
  <div>噗噗，未安装的应用</div>
  <div>应用的注册名为{{ init }}</div>
</template>
