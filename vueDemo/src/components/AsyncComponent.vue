<script setup lang="ts">
import { ref, onMounted } from 'vue'

const imageSrc = ref('https://img.51miz.com/Element/00/78/97/54/5fd1f136_E789754_21cb0c49.png')

</script>
<template>
    <img v-bind:src="imageSrc" width="100" height="100" />
</template>