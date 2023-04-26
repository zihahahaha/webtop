<script setup lang="ts">
import { inject, ref } from "vue";
import { thinModeKey, routerRefKey } from "./key";
import type { Ref } from "vue";
import type { MenuOption } from "@/component/type";
import Menu from "@/component/Menu.vue";

const thinMode = inject(thinModeKey);
const routerRef = inject(routerRefKey);

const props = defineProps<{
  menuOptions: MenuOption[];
  index: string;
  name: string;
}>();
const emit = defineEmits<{
  (e: "update:index", index: string): void;
}>();
const activeOption: Ref<MenuOption | undefined> = ref(
  props.menuOptions.find((i) => i.index === props.index)
);
function onUpdateOption(option: MenuOption) {
  emit("update:index", option.index);
  activeOption.value = option;
}
</script>

<template>
  <div class="selector-panel">
    <div class="menu" v-if="!thinMode">
      <div class="mainpage" @click="routerRef?.to('category panel')">主页</div>
      <div class="name">{{ name }}</div>
      <Menu
        class="menu-content"
        :index="index"
        @update:option="onUpdateOption"
        :menuOptions="menuOptions"
      />
    </div>
    <div class="panel">
      <div class="title" :class="{ thinmode: thinMode }">
        {{ activeOption?.label }}
      </div>
      <div class="panel-slot">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.selector-panel {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
}
.menu {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-top: 25px;
  width: 300px;
  height: 100%;
  background-color: #e6e6e6;
}

.menu-content {
  flex: 1;
}

.panel {
  box-sizing: border-box;
  padding-top: 55px;
  padding-left: 15px;
  flex: 1;
  position: relative;
}
.title {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  left: 0;
  top: 25px;
  font-size: 20px;
  font-weight: 700;
  background-color: white;
  height: 30px;
  line-height: 30px;
  padding-left: 15px;
}
.panel-slot {
  position: relative;
  width: 100%;
  height: 100%;
}
.thinmode {
  background-color: #e6e6e6;
}

.name {
  font-weight: 700;
}
.mainpage {
  user-select: none;
}
.mainpage:hover {
  background-color: gray;
}
</style>
