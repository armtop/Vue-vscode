<template>
    <div>
        <p>HomePage</p>
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        <p>
            pathMatch:{{ $route.params.pathMatch }}
        </p>
        <ul>
            <li>
                <router-link to="/portal">portal</router-link>
            </li>
        </ul>
    </div>

</template>