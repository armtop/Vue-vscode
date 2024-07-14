<template>
    <div>
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        User {{ $route.params.afterUser }} 
    </div>
</template>