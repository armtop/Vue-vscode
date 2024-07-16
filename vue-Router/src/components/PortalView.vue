<template>
    <div>
        <p>portal</p>
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        <p>
            pathMatch:{{ $route.params.pathMatch }}
        </p>
    </div>

</template>