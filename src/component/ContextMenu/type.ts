import type { Ref } from "vue";
export interface ActionType {
  label: string;
  trigger: Function;
  checked?: boolean | Ref<boolean>;
  hr?: boolean;
  disable?: boolean | Ref<boolean>;
  selected?: boolean;
}

export interface MenuType {
  label: string;
  children?: Array<MenuType | ActionType | ActionType[]>;
  hr?: boolean;
  disable?: boolean | Ref<boolean>;
}
