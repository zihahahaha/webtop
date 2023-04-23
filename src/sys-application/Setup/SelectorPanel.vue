<script setup lang="ts">
import { inject, computed, ref } from "vue";
import { widthKey } from "@/key";
import type { MenuOption } from "@/component/type";
import Menu from "@/component/Menu.vue";
const width = inject(widthKey);
const menuFlag = computed(() => {
  if (width!.value > 700) return true;
  else return false;
});
defineProps<{
  menuOptions: MenuOption[];
  index: string;
}>();
const emit = defineEmits(["update:index"]);
</script>

<template>
  <div class="selector-panel">
    <Menu
      v-if="menuFlag"
      :index="index"
      @update:index="(value) => emit('update:index', value)"
      class="menu"
      :menuOptions="menuOptions"
    />
    <div class="panel">
      <slot />
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
  padding-top: 25px;
  width: 300px;
  height: 100%;
  background-color: #e6e6e6;
}
.panel {
  box-sizing: border-box;
  padding-top: 25px;
  padding-left: 15px;
  flex: 1;
}
</style>
