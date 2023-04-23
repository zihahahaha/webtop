import { reactive, toRef } from "vue";
import { registeredComponents } from "./appManager";
import type { WndBase, Task } from "@/type";

interface WidPool {
  widFlag: boolean[];
  getFreeWid(): number | undefined;
  freeWid(wid: number): void;
}

const widPool: WidPool = {
  widFlag: Array(1000),
  getFreeWid(): number | undefined {
    for (let i = 0; i < 1000; ++i) {
      if (!this.widFlag[i]) {
        this.widFlag[i] = true;
        return i;
      }
    }
  },
  freeWid(wid: number) {
    this.widFlag[wid] = false;
  },
};

interface WndCreate {
  aid: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  mode?: "minimum" | "maximum" | "windowed";
}

export const __wnds = reactive([]) as Wnd[];
export const __tasks = reactive([]) as Task[];

export const __wndManager = {
  __remove(index: number) {
    widPool.freeWid(__wnds[index].wid);
    __wnds.forEach((i) => {
      if (i["z-index"] > __wnds[index]["z-index"]) i["z-index"]--;
    });
    registeredComponents[__wnds[index].aid].count--;
    __wnds.splice(index, 1);
    __tasks.splice(index, 1);
  },
  __active(index: number) {
    __wnds.forEach((i) => {
      if (i["z-index"] > __wnds[index]["z-index"]) i["z-index"]--;
    });
    __wnds[index]["z-index"] = __wnds.length;
  },
  __wOrMaximize(index: number) {
    if (__wnds[index].mode === "windowed") __wnds[index].mode = "maximum";
    else if (__wnds[index].mode === "maximum") __wnds[index].mode = "windowed";
  },
  __minimize(index: number) {
    const saveMode = __wnds[index].mode;
    if (saveMode !== "minimum") {
      __wnds[index].minSavedMode = saveMode;
      __wnds[index].mode = "minimum";
    }
  },
  __windowimize(index: number) {
    __wnds[index].mode = "windowed";
  },
  __restoreMinSavedMode(index: number) {
    const mode = __wnds[index].mode;
    if (mode !== "minimum")
      if (__wnds[index]["z-index"] !== __wnds.length) {
        this.__active(index);
        return;
      }
    __wnds[index].mode = __wnds[index].minSavedMode!;
    __wnds[index].minSavedMode = mode;
  },
};

export class Wnd implements WndBase {
  constructor(wndCreate: WndCreate) {
    const wid = widPool.getFreeWid();
    if (wid === undefined) throw undefined;
    else this.wid = wid;
    if (wndCreate.x !== undefined) this.x = wndCreate.x;
    if (wndCreate.y !== undefined) this.y = wndCreate.y;
    if (wndCreate.width !== undefined) this.width = wndCreate.width;
    if (wndCreate.height !== undefined) this.height = wndCreate.height;
    this.aid = wndCreate.aid;
    this["z-index"] = __wnds.length + 1;
  }
  aid: string;
  x: number = 100;
  y: number = 100;
  width: number = 640;
  height: number = 480;
  title: string = "";
  icon: string = "";
  themeColor: string = "black";
  titleBar: {
    flag: boolean;
    contextMenu: boolean;
    minimizeButton: boolean;
    maximizeButton: boolean;
  } = {
    flag: true,
    contextMenu: true,
    maximizeButton: true,
    minimizeButton: true,
  };
  border: {
    flag: boolean;
    width: number;
  } = {
    flag: true,
    width: 1,
  };
  mode: "minimum" | "maximum" | "windowed" = "windowed";
  wid: number;
  "z-index": number;
  minSavedMode: "minimum" | "maximum" | "windowed" = "minimum";
  init?: unknown;
}

export const wndManager = {
  push(wndCreate: WndCreate): number | undefined {
    try {
      let wnd: Wnd;
      if (registeredComponents[wndCreate.aid]) {
        if (
          registeredComponents[wndCreate.aid].singleton &&
          registeredComponents[wndCreate.aid].count >= 1
        )
          return;

        wnd = new Wnd(wndCreate);
        wnd.init = {
          icon: registeredComponents[wndCreate.aid].icon,
          application_name:
            registeredComponents[wndCreate.aid].application_name,
        };
      } else {
        wnd = new Wnd(wndCreate);
        wnd.init = wnd.aid;
        wnd.aid = "sys-error";
      }
      const index = __wnds.push(wnd);
      __tasks.push({
        title: toRef(__wnds[index - 1], "title"),
        icon: toRef(__wnds[index - 1], "icon"),
      });
      registeredComponents[wndCreate.aid].count++;
      return wnd.wid;
    } catch (e) {
      return undefined;
    }
  },
};
