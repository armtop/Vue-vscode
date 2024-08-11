<template>
  <t-button v-bind="$attrs" :new-prop="newProp" v-on="$attrs">
    <slot></slot>
  </t-button>
</template>

<script>
import { Button as TButton } from 'tdesign-vue-next';

export default {
  name: 'MyExtendedButton',
  extends: TButton,
  props: {
    newProp: {
      type: String,
      default: 'default value',
    },
  },
};
</script>
