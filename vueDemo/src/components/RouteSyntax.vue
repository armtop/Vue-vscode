<script setup lang="ts">
import { ref, computed } from "vue";
import Test from "./Test.vue";
import Posts from "./Posts.vue";
import HelloWorld from "./HelloWorld.vue";

const routes = {
    "/": HelloWorld,
    "/test": Test,
    "/posts": Posts
}

const currentPath = ref(window.location.hash)
window.addEventListener("hashchange", () => {
    currentPath.value = window.location.hash
})

const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || "/"] || NotFound
})
</script>
<template>
    <a href="#/">HelloWorld</a>
    <a href="#/test">Test</a>
    <a href="#/posts">Posts</a>
    <keep-alive>
        <component :is="currentView" />
    </keep-alive>
</template>