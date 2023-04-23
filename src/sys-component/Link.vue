<script setup lang="ts">
import { iconSize } from "@/data";

withDefaults(
  defineProps<{
    spanning?: boolean;
    size: "tall" | "grande" | "venti";
    title: string;
    icon: string;
  }>(),
  {
    spanning: false,
  }
);
</script>

<template>
  <div class="link" :style="{ 'z-index': spanning ? 999 : 'unset' }">
    <div :class="`link-wrapper${spanning ? '--spanning' : ''}`">
      <img class="icon" :src="icon" alt="" draggable="false" />
      <div
        class="title"
        :style="{ '-webkit-line-clamp': spanning ? 'unset' : '' }"
      >
        {{ title }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.link {
  position: relative;
  margin: 5px 2px;
  width: v-bind("`${iconSize[size].width}px`");
  height: v-bind("`${iconSize[size].height + 40}px`");
}

.link-wrapper {
  overflow: hidden;
  user-select: none;
}

.link-wrapper:hover {
  background-color: rgba(145, 195, 230, 0.2);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.link-wrapper--spanning {
  overflow: hidden;
  user-select: none;
  background-color: rgba(145, 195, 230, 0.2);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.link-wrapper--spanning:hover {
  background-color: rgba(98, 168, 223, 0.4);
}

.icon {
  user-select: none;
  display: block;
  object-fit: contain;
  width: v-bind("`${iconSize[size].width}px`");
  height: v-bind("`${iconSize[size].height}px`");
}

.title {
  width: 100%;
  word-wrap: break-word;
  text-align: center;
  display: -webkit-box;
  font-size: 13px;
  line-height: 20px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-shadow: 0 0 2px black;
  color: white;
}
</style>
