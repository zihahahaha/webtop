<script setup lang="ts"></script>

<template>
  <button class="button"><slot /></button>
</template>

<style scoped>
.button {
    border: none;
    padding:0 15px;
    line-height: 25px;
    background-color: #cccccc;
}
</style>
