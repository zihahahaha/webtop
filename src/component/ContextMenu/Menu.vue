<script setup lang="ts">
import type { ActionType, MenuType } from "./type";
import { ref, watch, computed } from "vue";
import type { Ref } from "vue";
import Menu from "./Menu.vue";
import Action from "./Action.vue";
import ActionGroup from "./ActionGroup.vue";

const props = defineProps<{
  menu: MenuType;
  activeFlag: boolean;
  xPolicy: "left" | "right";
}>();

// 活跃子Menu
let activeIndex = ref(-1);
watch(
  () => props.activeFlag,
  () => {
    activeIndex.value = -1;
  }
);
function onMouseEnter(index: number) {
  activeIndex.value = index;
}
// 子Mneu位置
const menuRef: Ref<HTMLElement | undefined> = ref();
const subMenuRef: Ref<HTMLElement | undefined> = ref();
const yPolicy: Ref<"top" | "bottom"> = ref("top");
watch(
  () => props.activeFlag,
  (value) => {
    if (value == true) {
      const menuRect = menuRef.value?.getBoundingClientRect();
      const subMenuRect = subMenuRef.value?.getBoundingClientRect();
      if (menuRect!.y - (subMenuRect!.height - menuRect!.height) < 0)
        yPolicy.value = "top";
      else yPolicy.value = "bottom";
    }
  }
);

//trigger
const emit = defineEmits(["close"]);
function close() {
  activeIndex.value = -1;
  emit("close");
}
</script>

<template>
  <div class="menu" ref="menuRef">
    <div class="menu-label">
      <div class="label">{{ menu.label }}</div>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon">
        <polyline points="5 5, 11 10.5, 5 16" />
      </svg>
    </div>
    <div class="hr" v-if="menu.hr"></div>
    <div
      class="menu-content"
      :class="[`--${xPolicy}`, `--${yPolicy}`]"
      :style="{ visibility: activeFlag ? 'visible' : 'hidden' }"
      ref="subMenuRef"
    >
      <template v-for="(i, index) in menu.children">
        <Menu
          v-if="(i as MenuType).children"
          :menu="i as MenuType"
          :activeFlag="index === activeIndex"
          :xPolicy="xPolicy"
          @mouseenter="onMouseEnter(index)"
          @close="close"
        />
        <ActionGroup v-else-if="i instanceof Array" :actions="i" @close="close" />
        <Action
          v-else
          :action="i as ActionType"
          @mouseenter="onMouseEnter(index)"
          @click="close()"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.menu {
  position: relative;
  background-color: #eeeeee;
  margin: 4px 0;
}

.menu-label {
  display: flex;
}

.menu-label:hover {
  background-color: #ffffff;
}

.label {
  padding-left: 20px;
  padding-right: 70px;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
}

.icon {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: #4f4f4f;
  stroke-width: 1px;
}

.menu-content {
  position: absolute;
  left: calc(100% - 5px);
  max-width: 250px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  border: solid 1px rgb(161, 161, 161);
  background-color: #eeeeee;
  z-index: 1;
}

.--left {
  left: 5px;
  transform: translateX(-100%);
}

.--top {
  top: 0;
}

.--right {
  left: calc(100% - 5px);
}

.--bottom {
  bottom: 0;
}
.hr {
  margin: 0 8px;
  height: 0;
  box-shadow: 0 0 0 1px #919191;
}
</style>
