<template>
    <div>
        <p>UserView</p>
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        afterUser: {{ $route.params.afterUser }}
        <p>
            pathMatch:{{ $route.params.pathMatch }}
        </p>
        <p>子模板：</p>
        <router-view />
    </div>

</template>