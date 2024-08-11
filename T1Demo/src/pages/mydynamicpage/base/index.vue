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
  <div>
    <p>{{ a }}</p>
    <h1>{{ $t('pages.result.networkError.title') }}</h1>
    <h1>{{ $t('pages.mydynamicpage.messages.greeting') }}</h1>
    <h1>{{ $t('pages.result.messages.greeting') }}</h1>
    <p>
      <my-extended-button new-prop="custom value"> {{ $t('components.msg') }} </my-extended-button>
    </p>
  </div>
</template>
