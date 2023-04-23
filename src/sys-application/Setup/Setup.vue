<script setup lang="ts">
import { ref, inject, toRef } from "vue";
import {
  titleKey,
  iconKey,
  titleBarKey,
  closeKey,
  minimizeKey,
  maximizeKey,
  windowizeKey,
  xKey,
  yKey,
  widthKey,
  heightKey,
  modeKey,
  borderKey,
} from "@/key";
import useTitlebar from "@/hook/use-titlebar";
import Router from "@/component/Router.vue";
import CategoryPanel from "./CategoryPanel.vue";
import Customization from "./Customization/Customization.vue";
import Application from "./Application/Application.vue";
import System from "./System/System.vue";
const title = inject(titleKey);
title!.value = "设置";
const icon = inject(iconKey);

const titleBar = inject(titleBarKey);
titleBar!.flag = false;

const activeIndex = ref("category panel");

const wndRef = ref();
const btnBarRef = ref();
const routerRef = ref();

const close = inject(closeKey);
const minimize = inject(minimizeKey);
const maximize = inject(maximizeKey);
const windowize = inject(windowizeKey);

const x = inject(xKey);
const y = inject(yKey);
const width = inject(widthKey);
const height = inject(heightKey);
const mode = inject(modeKey);
const border = inject(borderKey);

const onDrag = useTitlebar(
  x!,
  y!,
  width!,
  height!,
  toRef(border!, "width"),
  mode!,
  wndRef,
  windowize!,
  undefined,
  btnBarRef
);

//test
y!.value = 50;
width!.value = 800;
</script>

<template>
  <div class="setup" ref="wndRef">
    <div class="titlebar" @mousedown="onDrag" @dblclick="maximize!()">
      <div style="display: flex" @dblclick.stop>
        <div class="btn" @click.prevent="routerRef.back()"></div>
      </div>
      <div class="title">{{ title }}</div>
      <div style="display: flex" ref="btnBarRef">
        <div class="btn -minimize" @click="minimize!()"></div>
        <div class="btn --maximize" @click="maximize!()"></div>
        <div class="btn -close" @click="close!()"></div>
      </div>
    </div>
    <div class="client">
      <Router v-model:index="activeIndex" ref="routerRef">
        <CategoryPanel
          v-if="activeIndex === 'category panel'"
          v-model:index="activeIndex"
          :options="[
            {
              label: '个性化',
              index: 'customization',
            },
            {
              label: '应用',
              index: 'application',
            },
            {
              label: '系统',
              index: 'system',
            },
          ]"
        />
        <Customization v-if="activeIndex === 'customization'" />
        <Application v-if="activeIndex === 'application'" />
        <System v-if="activeIndex === 'system'" />
      </Router>
    </div>
  </div>
</template>

<style scoped>
.setup {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.client {
  position: absolute;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 0;
  background-color: #fff;
}
</style>

<style scoped>
.titlebar {
  display: flex;
  position: absolute;
  top: 0;
  width: 100%;
  height: 25px;
  user-select: none;
  z-index: 1;
}
.title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 25px;
}
.btn {
  width: 17px;
  height: 17px;
  margin: 4px 7px;
  background-color: black;
}
</style>
