<template>
    <div>
        <p>UserProfile</p>
        <p>
            <strong>Current route path:</strong> {{ $route.fullPath }}
        </p>
        username: {{ $route.params.username }} with post {{ $route.params.postId }}
        <p>
            pathMatch:{{ $route.params.pathMatch }}
        </p>
        <nav>
            <RouterLink to="/users/abc/posts">/users/abc/posts</RouterLink>
        </nav>
    </div>

</template>