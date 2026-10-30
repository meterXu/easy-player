<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <ul class="nav-ul">
      <li>
        <router-link to="/">test1</router-link>
      </li>
      <li>
        <router-link to="/test2">test2</router-link>
      </li>
    </ul>
  </nav>
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
  margin: 0.8rem 0;
}

nav .nav-ul{
  padding-left: 0;
  width: 100%;
  list-style-type: none;
}

nav .nav-ul li{
  text-align: left;
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
</style>
