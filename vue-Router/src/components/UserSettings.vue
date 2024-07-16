<script setup lang="ts">
import UserSettingsNav from './UserSettingsNav.vue';
</script>
<template>
    <div class="us">
        <h2>User Settings</h2>
        <UserSettingsNav />
        <router-view class="us-content" />
        <router-view name="helper" class="us__content us__content--helper" />
    </div>
</template>