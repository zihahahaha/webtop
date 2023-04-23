import type { Wnd } from "@/wndManager";

import type { Ref, InjectionKey } from "vue";
export const widthKey: InjectionKey<Ref<number>> = "width" as any;
export const heightKey: InjectionKey<Ref<number>> = "height" as any;
export const xKey: InjectionKey<Ref<number>> = "x" as any;
export const yKey: InjectionKey<Ref<number>> = "y" as any;
export const titleKey: InjectionKey<Ref<string>> = "title" as any;
export const iconKey: InjectionKey<Ref<string>> = "icon" as any;
export const titleBarKey: InjectionKey<Wnd["titleBar"]> = "titleBar" as any;
export const borderKey: InjectionKey<Wnd["border"]> = "border" as any;
export const modeKey: InjectionKey<Ref<Wnd["mode"]>> = "mode" as any;
export const closeKey: InjectionKey<() => {}> = "close" as any;
export const maximizeKey: InjectionKey<() => {}> = "maximize" as any;
export const minimizeKey: InjectionKey<() => {}> = "minimize" as any;
export const windowizeKey: InjectionKey<() => {}> = "windowize" as any;
export const maskRefKey: InjectionKey<Ref<HTMLElement>> = "maskRef" as any;
export const maskFlagKey: InjectionKey<Ref<boolean>> = "maskFlag" as any;
export const initKey: InjectionKey<unknown> = "init" as any;
