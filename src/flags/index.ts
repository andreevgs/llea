import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";
import EnFlag from "./EnFlag.vue";
import RuFlag from "./RuFlag.vue";
import PlFlag from "@/flags/PlFlag.vue";
import BeFlag from "@/flags/BeFlag.vue";
import LtFlag from "@/flags/LtFlag.vue";
import TrFlag from "@/flags/TrFlag.vue";
import EsFlag from "@/flags/EsFlag.vue";

const FlagNameToComponent: any = {
  EnFlag,
  RuFlag,
  PlFlag,
  BeFlag,
  LtFlag,
  TrFlag,
  EsFlag,
};

const aliases: any = {
  "flag-en": EnFlag,
  "flag-ru": RuFlag,
  "flag-pl": PlFlag,
  "flag-be": BeFlag,
  "flag-lt": LtFlag,
  "flag-tr": TrFlag,
  "flag-es": EsFlag,
};

const flagsIcons: IconSet = {
  component: (props: IconProps) => h(FlagNameToComponent[props.icon as string]),
};

export { flagsIcons, aliases };
