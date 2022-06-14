<template>
  <component :is="iconTypes[iconType] || name || icon"></component>
</template>

<script>
import { inject } from "vue";

export default {
  props: {
    icon: { type: [String, Object], default: "" },
    name: { type: [String, Object], default: "" },
    iconType: { type: String, default: "" },
  },
  setup() {
    let iconTypes = inject("icon-types", {});

    return {
      iconTypes,
    };
  },
};
</script>
