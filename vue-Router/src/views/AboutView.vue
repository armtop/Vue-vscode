<template>
  <div>
    <p>路由1
    <nav>
      <RouterLink to="/class">Go to class</RouterLink>
      <RouterLink to="/class/tom">Go to tom</RouterLink>
      <RouterLink to="/class/tom/a">tom/a</RouterLink>
      <RouterLink to="/users/eduardo/posts/1">/users1</RouterLink>
      <RouterLink to="/users/abc">children</RouterLink>
      <RouterLink to="/users/abc/profile">/users/abc/profile</RouterLink>
      <RouterLink to="/users/abc/posts">/users/abc/posts</RouterLink>
      <RouterLink to="/users/eduardo/posts/20/q">/users20/q</RouterLink>
      <RouterLink to="/users/eduardo/posts/A30">/usersA30</RouterLink>
      <RouterLink to="/user-">/user-</RouterLink>
      <RouterLink to="/abc/123/ABC">/ABC</RouterLink>
    </nav>
    </p>
    <p>路由2
    <nav>
      <!-- 配合命名路由 -->
      <router-link :to="{ name: 'class' }">/className</router-link>
      <router-link :to="{ name: 'tom', params: { tom: 'ABC' } }">/classtom</router-link>
      <!-- 配合命名视图 -->
      <router-link to="/homepage">/homepage</router-link>
      <router-link to="/settings">/settings</router-link>
    </nav>
    </p>

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
