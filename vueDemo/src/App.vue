<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { defineAsyncComponent } from 'vue'
//import Test from './components/Test.vue'
import { ref } from 'vue'
import ChildComponent from './components/ChildComponent.vue'

const Test = defineAsyncComponent(() =>
  import('./components/Test.vue')
)

const msg = ref('hahaha');

const first = ref('John')
const last = ref('Doe')

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <p>
        <Test title="Why Vue is so fun" v-model="msg" />
      <h1>{{ msg }}</h1>
      </p>
      <p>
        <ChildComponent v-model:first-name="first" v-model:last-name="last" />
      <p>{{ first }} {{ last }}</p>
      </p>

      <BaseLayout>
        <template #header>
          <h1>Here might be a page title</h1>
        </template>

        <template #default>
          <p>A paragraph for the main content.</p>
          <p>And another one.</p>
        </template>

        <template #footer>
          <p>Here's some contact info</p>
        </template>
      </BaseLayout>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>


<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
