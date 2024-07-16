<template>
    <dev>
        <p>TomWelcome</p>
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        <p>
            pathMatch:{{ $route.params.pathMatch }}
        </p>
    </dev>
</template>