<script setup lang="ts">
let test = document.querySelector("#TestUse");
if (!test) {
    test = document.createElement("div");
    test.id = "TestUse";
    document.body.appendChild(test);
}
</script>

<template>
    <Teleport to="#TestUse">
        <div class="unit">
            <slot />
        </div>
    </Teleport>
</template>

<style>
#TestUse {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 999;
}
</style>

<style scoped>
.unit {
    margin: 10px 0;
}

:slotted(*) {
    display: block;
}
</style>