import type { Ref } from "vue";

export default function (
  x: Ref<number>,
  y: Ref<number>,
  width: Ref<number>,
  height: Ref<number>,
  borderWidth: Ref<number>,
  mode: Ref<"windowed" | "maximum" | "minimum">,
  wndRef: Ref<HTMLElement>,
  windowize: Function,
  lRef?: Ref<HTMLElement>,
  rRef?: Ref<HTMLElement>
) {
  return function onDragStart(e: MouseEvent) {
    e.preventDefault();
    let init_x = x.value;
    let init_y = y.value;
    if (mode?.value == "maximum") {
      const rect = wndRef.value.getBoundingClientRect();
      // 窗口化后的标题栏内offset
      const offsetX =
        (e.offsetX / (rect.width - 2 * borderWidth.value)) *
        (width.value - 2 * borderWidth.value);
      if (
        offsetX >
        width.value -
          2 * borderWidth.value -
          (rRef ? rRef.value.offsetWidth : 0)
      )
        init_x =
          e.clientX -
          rect.x -
          (width.value -
            2 * borderWidth.value -
            (rRef ? rRef.value.offsetWidth : 0)) -
          1;
      else init_x = e.clientX - rect.x - offsetX - borderWidth.value;
      init_y = 0;
    }
    const init_mouse_x = e.pageX;
    const init_mouse_y = e.pageY;
    function onDrag(e: MouseEvent) {
      windowize();
      x.value = init_x + (e.pageX - init_mouse_x);
      y.value = init_y + (e.pageY - init_mouse_y);
    }
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", function xxx() {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", xxx);
    });
  };
}
