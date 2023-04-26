import type { InjectionKey, Ref, ComponentPublicInstance } from "vue";

export const thinModeKey = Symbol() as InjectionKey<Ref<boolean>>;

export const routerRefKey = Symbol() as InjectionKey<
  Ref<ComponentPublicInstance<{ to: (index: string) => void }>>
>;
