import type { Ref, Component } from "vue";

export interface WndBase {
  title: string;
  aid: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  themeColor: string;
  titleBar: {
    flag: boolean;
    contextMenu: boolean;
    minimizeButton: boolean;
    maximizeButton: boolean;
  };
  border: {
    flag: boolean;
    width: number;
  };
  mode: "minimum" | "maximum" | "windowed";
  init?: unknown;
}

export interface Task {
  title: Ref<string>;
  icon: Ref<string>;
}

export interface LinkBase {
  title: string;
  icon: string;
  aid: string;
  file?: string;
  mode?: "windowed" | "maximum";
  x?: number;
  y?: number;
}

export interface Application {
  // 默认注册名使用请求时的地址名
  register_name?: string;
  appliaction_name: string;
  detail?: string;
  icon?: string;
  singleton: boolean;
  component: Component;
}
