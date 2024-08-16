<script>
import MyExtendedButton from '../../../components/custom/MyExtendedButton.vue';

export default {
  components: {
    MyExtendedButton,
  },
};
const a = 1;
</script>
<template>
  <t-space direction="vertical">
    <div>
      <t-layout>
        <t-header>
          <p>Header</p>
          <p>{{ a }}</p>
        </t-header>
        <t-layout>
          <t-content>
            <p>Content</p>
            <p>{{ $t('pages.result.networkError.title') }}</p>
            <p>
              <my-extended-button new-prop="custom value"> {{ $t('components.msg') }} </my-extended-button>
            </p>
          </t-content>
          <t-aside>Aside {{ $t('pages.mydynamicpage.messages.greeting') }}</t-aside>
        </t-layout>
        <t-footer>
          <p>Footer</p>
          <p>{{ $t('pages.result.messages.greeting') }}</p>
        </t-footer>
      </t-layout>
    </div>
  </t-space>
</template>
