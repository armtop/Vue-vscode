<template>
  <div class="about">
    <p>
      <strong>Current route path:</strong> {{ $route.fullPath }}
    </p>
    <nav>
      <RouterLink to="/class">Go to class</RouterLink>
      <RouterLink to="/tom">Go to tom</RouterLink>
      <RouterLink to="/users/eduardo/posts/1">/users1</RouterLink>
      <RouterLink to="/users/eduardo/posts/20">/users20</RouterLink>
      <RouterLink to="/users/eduardo/posts/30">/users30</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
