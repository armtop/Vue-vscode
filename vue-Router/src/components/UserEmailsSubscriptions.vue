<template>
    <div>
        <p>UserEmailsSubscriptions</p>
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        afterUser: {{ $route.params.afterUser }}

        <p>
            pathMatch:{{ $route.params.pathMatch }}
        </p>
    </div>
</template>