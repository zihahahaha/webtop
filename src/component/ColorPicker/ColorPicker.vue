<script setup lang="ts">
import Input from "./Input.vue";
import { unsignedValidate } from "./hook";
import { watchEffect, type Ref } from "vue";
import { ref, computed, watch } from "vue";
const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const palleteX = ref(0);
const palleteY = ref(0);

const bSliderTop = ref(200);
const alphaSliderTop = ref(0);

const r = ref(0);
const g = ref(255);
const b = ref(0);
const alpha = ref(100);

watch(
  () => props.modelValue,
  () => {
    const groups =
      /rgba\((?<r>\d{1,3}),(?<g>\d{1,3}),(?<b>\d{1,3}),(?<alpha>\d{1,3})%\)/.exec(
        props.modelValue
      )?.groups;
    if (groups) {
      r.value = Number(groups.r);
      g.value = Number(groups.g);
      b.value = Number(groups.b);
      alpha.value = Number(groups.alpha);
      palleteX.value = g2x(g.value);
      palleteY.value = r2y(r.value);
      bSliderTop.value = b2top(b.value);
      alphaSliderTop.value = alpha2top(alpha.value);
    }
  },
  {
    immediate: true,
  }
);
watchEffect(() => {
  emit(
    "update:modelValue",
    `rgba(${r.value},${g.value},${b.value},${alpha.value}%)`
  );
});

//tools
function r2y(r: number) {
  return ((255 - r) / 255) * 200;
}
function g2x(g: number) {
  return (g / 255) * 200;
}
function b2top(b: number) {
  return ((255 - b) / 255) * 200;
}
function alpha2top(alpha: number) {
  return ((100 - alpha) / 100) * 200;
}
function y2r(y: number) {
  return Math.floor(((200 - y) / 200) * 255);
}
function x2g(x: number) {
  return Math.floor((x / 200) * 255);
}
function top2b(top: number) {
  return Math.floor(((200 - top) / 200) * 255);
}
function top2alpha(top: number) {
  return Math.floor(((200 - top) / 200) * 100);
}
// Palette
function changeColorByPallete(e: MouseEvent) {
  palleteX.value = e.offsetX;
  palleteY.value = e.offsetY;
  r.value = y2r(palleteY.value);
  g.value = x2g(palleteX.value);

  const rect = (e.currentTarget as Element).getBoundingClientRect();
  function move(e: MouseEvent) {
    palleteY.value = e.clientY - rect.y;
    palleteX.value = e.clientX - rect.x;
    if (palleteX.value < 0) palleteX.value = 0;
    if (palleteX.value > 200) palleteX.value = 200;
    if (palleteY.value < 0) palleteY.value = 0;
    if (palleteY.value > 200) palleteY.value = 200;
    r.value = y2r(palleteY.value);
    g.value = x2g(palleteX.value);
  }
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", function xxx() {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", xxx);
  });
}

// Slider
function changeColorByBSlider(e: MouseEvent) {
  bSliderTop.value = e.offsetY;
  const rect = (e.currentTarget as Element).getBoundingClientRect();
  function move(e: MouseEvent) {
    bSliderTop.value = e.clientY - rect.y;
    if (bSliderTop.value < 0) bSliderTop.value = 0;
    if (bSliderTop.value > 200) bSliderTop.value = 200;
    b.value = top2b(bSliderTop.value);
  }
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", function xxx() {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", xxx);
  });
}

function chnageColorByAlphaSlider(e: MouseEvent) {
  alphaSliderTop.value = e.offsetY;
  const rect = (e.currentTarget as Element).getBoundingClientRect();
  function move(e: MouseEvent) {
    alphaSliderTop.value = e.clientY - rect.y;
    if (alphaSliderTop.value < 0) alphaSliderTop.value = 0;
    if (alphaSliderTop.value > 200) alphaSliderTop.value = 200;
    alpha.value = top2alpha(alphaSliderTop.value);
  }
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", function xxx() {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", xxx);
  });
}

// Input
function changeColorByR(value: string) {
  r.value = Number(value);
}
function changeColorByG(value: string) {
  g.value = Number(value);
}
function changeColorByB(value: string) {
  b.value = Number(value);
}
function changeColorByAlpha(value: string) {
  alpha.value = Number(value);
}
</script>

<template>
  <div class="color-picker">
    <div class="layout">
      <div class="pallete" @mousedown.prevent="changeColorByPallete">
        <div class="pallete-handle"></div>
      </div>
      <div class="blue-slider" @mousedown.prevent="changeColorByBSlider">
        <div
          class="slider-handle"
          :style="{ top: `${bSliderTop - 3.5}px` }"
        ></div>
      </div>
      <div class="alpha-slider" @mousedown.prevent="chnageColorByAlphaSlider">
        <div
          class="slider-handle"
          :style="{ top: `${alphaSliderTop - 3.5}px` }"
        ></div>
      </div>
    </div>
    <div class="color-alpha">
      <div class="color">rgba({{ r }},{{ g }},{{ b }},{{ alpha }}%)</div>
    </div>
    <div>
      <label>R</label>
      <Input
        @validate="unsignedValidate"
        :modelValue="r"
        @update:modelValue="changeColorByR"
      />
    </div>
    <div>
      <label>G</label>
      <Input
        @validate="unsignedValidate"
        :modelValue="g"
        @update:modelValue="changeColorByG"
      />
    </div>
    <div>
      <label>B</label>
      <Input
        @validate="unsignedValidate"
        :modelValue="b"
        @update:modelValue="changeColorByB"
      />
    </div>
    <div>
      <label>alpha(%)</label>
      <Input
        @validate="unsignedValidate"
        :modelValue="alpha"
        @update:modelValue="changeColorByAlpha"
      />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
}
</style>

<style scoped>
.pallete {
  position: relative;
  box-sizing: border-box;
  width: 200px;
  height: 200px;
  background-blend-mode: lighten;
  background-color: rgb(0, 0, v-bind("b"));
  background-image: linear-gradient(to right, rgb(0, 0, 0), rgb(0, 255, 0)),
    linear-gradient(to top, rgb(0, 0, 0), rgb(255, 0, 0));
}
.pallete-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: white;
  box-shadow: 0 0 2px black;
  border-radius: 100%;
  left: v-bind("`${palleteX - 5}px`");
  top: v-bind("`${palleteY - 5}px`");
  pointer-events: none;
}
</style>

<style scoped>
.blue-slider {
  position: relative;
  margin-left: 10px;
  width: 15px;
  height: 200px;
  background-image: linear-gradient(
    to top,
    rgb(v-bind("r"), v-bind("g"), 0),
    rgb(v-bind("r"), v-bind("g"), 255)
  );
}
.alpha-slider {
  position: relative;
  margin-left: 10px;
  height: 200px;
  width: 15px;
  background-color: gray;
  background-image: linear-gradient(white, black);
}
.slider-handle {
  box-sizing: border-box;
  position: absolute;
  width: 19px;
  height: 7px;
  left: -2px;
  background-color: white;
  box-shadow: 0 0 2px gray;
  pointer-events: none;
}
</style>

<style scoped>
.color-alpha {
  position: relative;
  user-select: none;
  margin-top: 10px;
  width: 250px;
  height: 25px;
  line-height: 25px;
  background-image: linear-gradient(45deg, #ddd 25%, #0000 25%),
    linear-gradient(-45deg, #ddd 25%, #0000 25%),
    linear-gradient(45deg, #0000 75%, #ddd 75%),
    linear-gradient(-45deg, #0000 75%, #ddd 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}
.color {
  background-color: rgba(
    v-bind("r"),
    v-bind("g"),
    v-bind("b"),
    v-bind("`${alpha}%`")
  );
  color: rgb(
    v-bind("(r+g+b)/3 > 127 || alpha < 50 ? 0 : 255"),
    v-bind("(r+g+b)/3 > 127 || alpha < 50  ? 0 : 255"),
    v-bind("(r+g+b)/3 > 127 || alpha < 50  ? 0 : 255")
  );
  text-align: center;
}
</style>
