<template>
    <div>
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        User {{ $route.params.username }} with post {{ $route.params.postId }}
    </div>
</template>