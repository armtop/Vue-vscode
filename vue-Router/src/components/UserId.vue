<script setup lang="ts">
defineProps({
    id: String
})
</script>
<template>
    <div>
        <p>UserPosts</p>
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        username: {{ $route.params.username }} with post {{ $route.params.postId }}
        <p>
            pathMatch:{{ $route.params.pathMatch }}
        </p>
        <p>
            User {{ id }}
        </p>
    </div>
</template>