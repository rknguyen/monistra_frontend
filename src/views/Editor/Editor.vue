<template>
  <div class="container">
    <div class="tools">
      <button :class="{ active: editorMode === 0 }" @click="editorMode = 0">Select</button>
      <button :class="{ active: editorMode === 1 }" @click="editorMode = 1">Rectangle</button>
      <button :class="{ active: editorMode === 2 }" @click="editorMode = 2">Ellipse</button>
    </div>
    <div id="konva-stage"></div>
  </div>
</template>

<style scoped>
@import './Editor.css';
</style>

<script lang="ts" src="./Editor.ts"></script>
