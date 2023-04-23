<script setup lang="ts">
// props 文件列表URL
import { ref, reactive, computed, toRef, watch } from "vue";
import type { Ref } from "vue";
import type { WndBase, LinkBase } from "@/type";
import { iconSize } from "@/data";
import { desktopState, links } from "@/store";
import { wndManager } from "@/wndManager";
import Link from "./Link.vue";
import ContextMenu from "@/component/ContextMenu";

let size: Ref<"tall" | "grande" | "venti"> = ref("tall");
const linkWidth = computed(() => iconSize[size.value].width + 4);
const linkHeight = computed(() => iconSize[size.value].height + 40 + 10);
const taskbarPos = toRef(desktopState, "taskbarPos");
const width = computed(() => {
  if (taskbarPos.value === "left" || taskbarPos.value === "right")
    return desktopState.width - desktopState.taskbarLength;
  else return desktopState.width;
});
const height = computed(() => {
  if (taskbarPos.value == "top" || taskbarPos.value == "bottom")
    return desktopState.height - desktopState.taskbarLength;
  else return desktopState.height;
});

interface LinkElse {
  spanning?: boolean;
  left?: number;
  top?: number;
}

const linkElses: LinkElse[] = reactive([]);
for (let i = 0; i < links.length; ++i) linkElses[i] = {};

let linkRef: InstanceType<typeof Link>[] = [];
function onRef(el: any, i: number) {
  linkRef[i] = el;
}

// 更改排序方式
watch(
  () => desktopState.mode,
  (value) => {
    if (value === "auto") {
      links.forEach((i) => {
        i.x = undefined;
        i.y = undefined;
      });
    } else {
      // 由于desktop先触发width，height改变，此时linkPanel还是flex布局，因此可以简化转换时的计算
      links.forEach((i, index) => {
        i.x = (linkRef[index].$el as HTMLElement).offsetLeft;
        i.y = (linkRef[index].$el as HTMLElement).offsetTop;
      });
    }
  }
);
const cntX = computed(() => {
  return Math.floor(width.value / linkWidth.value);
});
const cntY = computed(() => {
  return Math.floor(height.value / linkHeight.value);
});
function onAutoAlign() {
  if (desktopState.mode === "auto") return;
  let cnt = 0;
  loop: for (let i = 0; i < cntX.value; ++i)
    for (let j = 0; j < cntY.value; ++j) {
      links[cnt].x = i * linkWidth.value + 2;
      links[cnt].y = j * linkHeight.value + 5;
      cnt++;
      if (cnt >= links.length) break loop;
    }
}
function hashKey(x: number, y: number) {
  return x * 1000 + y;
}
let set = new Set<number>();
function alignToGrid() {
  linkElses.forEach((i) => (i.spanning = false));
  desktopState.alignToGrid = true;
  for (let i = 0; i < linkElses.length; ++i) {
    let orderX = Math.round((links[i].x! - 2) / linkWidth.value);
    let orderY = Math.round((links[i].y! - 5) / linkHeight.value);
    if (orderY > cntY.value - 1) {
      orderY = 0;
      orderX++;
    }
    while (set.has(hashKey(orderX, orderY))) {
      orderY++;
      if (orderY > cntY.value - 1) {
        orderY = 0;
        orderX++;
      }
    }
    set.add(hashKey(orderX, orderY));
    links[i].x = orderX * linkWidth.value + 2;
    links[i].y = orderY * linkHeight.value + 5;
  }
}
watch(
  () => desktopState.alignToGrid,
  (value) => {
    if (desktopState.mode === "fixed") {
      if (value) alignToGrid();
      else set.clear();
    }
  },
  {
    immediate: true,
  }
);
watch(() => desktopState.width,() => {
  onAutoAlign();
})
watch(()=>desktopState.height,()=>{
  onAutoAlign();
})
// 拖拽图标
let nowDragIndex: number | undefined;
let init_x: number;
let init_mouse_x: number;
let init_y: number;
let init_mouse_y: number;
function onDragStrat(e: DragEvent, i: number) {
  nowDragIndex = i;
  init_x = links[i]?.x as number;
  init_mouse_x = e.pageX;
  init_y = links[i].y as number;
  init_mouse_y = e.pageY;
  set.delete(
    +hashKey((init_x - 2) / linkWidth.value, (init_y - 5) / linkHeight.value)
  );
}
function onDragEnd() {
  nowDragIndex = undefined;
}
function onDrop(e: DragEvent) {
  let x = init_x + (e.pageX - init_mouse_x);
  let y = init_y + (e.pageY - init_mouse_y);
  if (x < 0) x = 0;
  if (x > width.value - linkWidth.value) x = width.value - linkWidth.value;
  if (y < 0) y = 0;
  if (y > height.value - linkHeight.value) y = height.value - linkHeight.value;
  if (desktopState.alignToGrid) {
    let orderX = Math.round(x / linkWidth.value);
    let orderY = Math.round(y / linkHeight.value);
    console.log(orderX, orderY);

    while (set.has(hashKey(orderX, orderY))) {
      orderY++;
      if (orderY > cntY.value - 1) {
        orderY = 0;
        orderX++;
      }
    }
    set.add(hashKey(orderX, orderY));
    x = orderX * linkWidth.value + 2;
    y = orderY * linkHeight.value + 5;
  }
  links[nowDragIndex as number].x = x;
  links[nowDragIndex as number].y = y;
}

// 点击图标
function onMouseDown(i: number) {
  linkElses.forEach((i) => (i.spanning = false));
  linkElses[i].spanning = true;
}
function onDoubleClick(
  aid: WndBase["aid"],
  mode: LinkBase["mode"],
  file?: string
) {
  wndManager.push({
    aid,
    mode,
  });
}
const autoAlignFLag = computed(() => {
  if (desktopState.mode === "auto") return true;
  else return false;
});
// 上下文菜单
const event = ref();
const panelContextMenu = [
  {
    label: "查看",
    children: [
      [
        {
          label: "桌面大小固定",
          trigger: () => {
            desktopState.mode = "fixed";
          },
          selected: desktopState.mode === "fixed",
        },
        {
          label: "桌面自动大小",
          trigger: () => {
            desktopState.mode = "auto";
          },
          selected: desktopState.mode === "auto",
          hr: true,
        },
      ],
      {
        label: "自动对齐",
        trigger: () => {
          onAutoAlign();
        },
        disable: autoAlignFLag,
      },
      {
        label: "对齐到网格",
        disable: autoAlignFLag,
        checked: toRef(desktopState, "alignToGrid"),
        hr: true,
      },
      {
        label: "显示桌面图标",
        checked: toRef(desktopState, "showLinks"),
      },
    ],
  },
  {
    label: "设置",
    trigger: () => {
      wndManager.push({
        aid: "sys-setup",
      });
    },
  },
];

//Test
const isAuto = computed(() => {
  if (desktopState.mode === "auto") {
    return true;
  } else {
    return false;
  }
});
let i = 0;
function onChange() {
  links.push({ title: i++ + "", icon: "", aid: "Test", mode: "windowed" });
  linkElses.push({});
}
function onTall() {
  size.value = "tall";
}
function onGrande() {
  size.value = "grande";
}
function onVenti() {
  size.value = "venti";
}

// wndManager.push({
//   aid: "sys-setup",
// });
</script>

<template>
  <Unit>
    <button @click="onChange" :disabled="!isAuto">change</button>
    <button @click="onTall">TALL</button>
    <button @click="onGrande">GRANDE</button>
    <button @click="onVenti">VENTI</button>
  </Unit>
  <div
    class="panel"
    :class="[`--${taskbarPos}`, `--${desktopState.backgroundType}`]"
    @contextmenu.prevent="event = $event"
  >
    <div
      class="link-layer"
      :class="`--${desktopState.mode}`"
      @dragover.prevent
      @drop="onDrop"
      v-show="desktopState.showLinks"
    >
      <Link
        v-for="(i, index) in links"
        :title="i.title"
        :icon="i.icon"
        :spanning="linkElses[index]?.spanning"
        :size="size"
        :draggable="desktopState.mode === 'auto' ? false : true"
        @dragstart="(e) => onDragStrat(e, index)"
        @dragend="onDragEnd"
        @mousedown="onMouseDown(index)"
        :ref="(el) => onRef(el, index)"
        @dblclick="onDoubleClick(i.aid, i.mode, i.file)"
        :style="{
          position: desktopState.mode === 'auto' ? '' : 'absolute',
          left: i?.x ? `${i?.x}px` : '',
          top: i?.y ? `${i?.y}px` : '',
          margin: desktopState.mode === 'auto' ? '' : 0,
        }"
      />
    </div>
    <div class="wnd-layer">
      <slot />
    </div>
    <ContextMenu :menus="panelContextMenu" :e="event" />
  </div>
</template>

<style scoped>
.panel {
  position: absolute;
  overflow: hidden;
  z-index: 0;
  background-position: center;
}

.--auto {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.--fixed {
}
.--top {
  left: 0;
  bottom: 0;
  width: 100%;
  height: calc(100% - v-bind("`${desktopState.taskbarLength}px`"));
}

.--bottom {
  left: 0;
  top: 0;
  width: 100%;
  height: calc(100% - v-bind("`${desktopState.taskbarLength}px`"));
}

.--left {
  right: 0;
  top: 0;
  width: calc(100% - v-bind("`${desktopState.taskbarLength}px`"));
  height: 100%;
}

.--right {
  left: 0;
  top: 0;
  width: calc(100% - v-bind("`${desktopState.taskbarLength}px`"));
  height: 100%;
}
.--color {
  background-color: v-bind("desktopState.backgroundColor.value");
}
.--image {
  background-image: v-bind("`url('${desktopState.backgroundImage.value}')`");
  background-position: v-bind("desktopState.backgroundImage.positon");
  background-size: v-bind("desktopState.backgroundImage.size");
}
</style>

<style scoped>
.link-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.wnd-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>
