// 属于活数据，可以动态修改并保存到后端
import { reactive } from "vue";
import type { LinkBase } from "@/type";

interface BackgroundColor {
  value: string;
}

interface BackgroundImage {
  value: string;
  positon: string;
  size: string;
}

interface DesktopState {
  width: number;
  height: number;
  mode: "auto" | "fixed";
  taskbarLength: number;
  taskbarPos: "top" | "left" | "right" | "bottom";
  taskbarLock: boolean;
  backgroundType: "image" | "color";
  backgroundImage: BackgroundImage;
  backgroundColor: BackgroundColor;
  showLinks: boolean;
  alignToGrid: boolean;
}

export const desktopState: DesktopState = reactive({
  mode: "fixed",
  width: 1200,
  height: 600,
  taskbarLength: 30,
  taskbarPos: "bottom",
  taskbarLock: false,
  backgroundType: "image",
  backgroundColor: {
    type: "color",
    value: "rgba(0, 0, 255, 0.3)",
  },
  backgroundImage: {
    value: "/bgc2.jpg",
    positon: "center",
    size: "contain",
  },
  showLinks: true,
  alignToGrid: false,
});

// 桌面图标列表
export const links: LinkBase[] = reactive([
  {
    title: "Apex Legends",
    icon: "apex.ico",
    aid: "Test",
    x: 2,
    y: 5,
  },
  {
    title: "《使命召唤®：现代战争®II 2022》  《战争地带2.0》",
    icon: "cod.ico",
    aid: "xxxx",
    x: 81,
    y: 5,
  },
]);

// 需安装应用列表
export const requestAppList = ["http://localhost:3000/Test.js"];


