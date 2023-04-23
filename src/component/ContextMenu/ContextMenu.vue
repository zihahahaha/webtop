<script setup lang="ts">
import type { ActionType, MenuType } from "./type";
import { onUnmounted, ref, watch } from "vue";
import type { Ref } from "vue";
import Menu from "./Menu.vue";
import Action from "./Action.vue";
import ActionGroup from "./ActionGroup.vue";

const props = defineProps<{
  menus: Array<MenuType | ActionType | ActionType[]>;
  e: MouseEvent;
}>();
let activeIndex = ref(-1);
const xPolicy: Ref<"right" | "left"> = ref("right");
function onMouseEnter(index: number) {
  activeIndex.value = index;
}

// contextmenu显示与隐藏
const showFlag = ref(false);
const contextMenuRef: Ref<HTMLElement | undefined> = ref();
(function () {
  function xxx() {
    showFlag.value = false;
    activeIndex.value = -1;
  }
  window.addEventListener("mousedown", xxx);
  onUnmounted(() => {
    window.removeEventListener("mousedown", xxx);
  });
})();
watch(
  () => props.e,
  () => {
    showFlag.value = true;
    const rect = contextMenuRef.value?.getBoundingClientRect();
    if (rect!.width + props.e.pageX > window.innerWidth) xPolicy.value = "left";
    else xPolicy.value = "right";
  }
);
function close() {
  showFlag.value = false;
  activeIndex.value = -1;
}
</script>

<template>
  <div
    class="context-menu"
    :style="{ visibility: showFlag ? 'visible' : 'hidden' }"
    ref="contextMenuRef"
    @mousedown.stop
  >
    <template v-for="(i, index) in menus">
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
        @click="close"
      />
    </template>
  </div>
</template>

<style scoped>
.context-menu {
  position: fixed;
  max-width: 200px;
  min-width: 150px;
  border: solid 1px rgb(161, 161, 161);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  left: v-bind("`${e?.pageX}px`");
  top: v-bind("`${e?.pageY}px`");
  background-color: #eeeeee;
  z-index: 999;
}
</style>
