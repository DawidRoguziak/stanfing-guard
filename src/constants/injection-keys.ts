import type {InjectionKey} from "vue";
import type {UiMenuOption} from "@/components/ui/UiMenu/UiMenuOption";
import type {Ref} from "vue";
import type {Layouts} from "@/components/layout/LayoutResolver.vue";
export const MENU_KEY_OPTIONS: InjectionKey<UiMenuOption[]> = Symbol('UiMenuOption');
export const PAGE_PADDING_CLASS_KEY: InjectionKey<Ref<string>> = Symbol('pagePadding');
export const PAGE_HEIGHT_CLASS: InjectionKey<Ref<string>> = Symbol('pageHeightClass');

export const LAYOUT_RESOLVER_KEY: InjectionKey<Ref<Layouts>> = Symbol('LayoutResolver');

