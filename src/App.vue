<template>
  <div id="app">
    <div id="nav">
      <router-link to="./">Home</router-link>
      {{' | '}}
      <router-link to="./editor">Editor</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Questrial&display=swap');

body {
  font-family: 'Questrial', sans-serif;
  font-size: 16px;
}

a,
a:visited {
  text-decoration: none;
}
</style>