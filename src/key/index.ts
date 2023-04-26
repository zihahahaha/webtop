import type { WndBase } from "../type";

import type { Ref, InjectionKey } from "vue";

//可读写
export const widthKey: InjectionKey<Ref<number>> = "width" as any;
export const heightKey: InjectionKey<Ref<number>> = "height" as any;
export const xKey: InjectionKey<Ref<number>> = "x" as any;
export const yKey: InjectionKey<Ref<number>> = "y" as any;
export const titleKey: InjectionKey<Ref<string>> = "title" as any;
export const iconKey: InjectionKey<Ref<string>> = "icon" as any;
export const modeKey: InjectionKey<Ref<WndBase["mode"]>> = "mode" as any;
export const titleBarKey: InjectionKey<WndBase["titleBar"]> = "titleBar" as any;
export const borderKey: InjectionKey<WndBase["border"]> = "border" as any;

export const maskFlagKey: InjectionKey<Ref<boolean>> = "maskFlag" as any;

//只读值
export const initKey: InjectionKey<unknown> = "init" as any;
export const readonlyWidthKey: InjectionKey<Ref<number>> =
  "readonlyWidth" as any;
export const readonlyHeightKey: InjectionKey<Ref<number>> =
  "readonlyHeight" as any;

//方法
export const closeFunctionKey: InjectionKey<() => {}> = "close" as any;
export const maximizeFunctionKey: InjectionKey<() => {}> = "maximize" as any;
export const minimizeFunctionKey: InjectionKey<() => {}> = "minimize" as any;
export const windowizeFunctionKey: InjectionKey<() => {}> = "windowize" as any;

// Ref
export const maskRefKey: InjectionKey<Ref<HTMLElement>> = "maskRef" as any;
