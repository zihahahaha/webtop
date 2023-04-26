// 便于全局引用，不用修改
import { ref, computed } from "vue";
import { desktopState } from "@/store";

export const maskFlag = ref(false);

export const loading = ref(true);

export const width = computed(() => {
  if (desktopState.taskbarPos === "left" || desktopState.taskbarPos === "right")
    return desktopState.width - desktopState.taskbarLength;
  else return desktopState.width;
});

export const height = computed(() => {
  if (desktopState.taskbarPos === "top" || desktopState.taskbarPos === "bottom")
    return desktopState.height - desktopState.taskbarLength;
  else return desktopState.height;
});
