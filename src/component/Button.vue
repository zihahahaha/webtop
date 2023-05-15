<script setup lang="ts"></script>

<template>
  <button class="button"><slot /></button>
</template>

<style scoped>
.button {
  box-sizing: border-box;
  border: none;
  padding: 0 15px;
  line-height: 25px;
  background-color: #ccc;
  border: solid 2px #ccc;
}
.button:hover {
  border: solid 2px #7a7a7a;
}
</style>
