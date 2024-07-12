<script setup lang="ts">
import { ref } from 'vue'
import { inject } from 'vue';

const i18n = inject('i18n');
console.log(i18n.greetings.world);

function interpret() {
    return i18n.greetings.world;
}


</script>
<template>
    <h1>{{ $translate('greetings.hello') }}</h1>
    <h1>{{ i18n.greetings.world }}</h1>
</template>