<template>
  <div class="container">
    <div class="tools">
      <button
        :class="{ active: isModeActive(NORMAL) }"
        @click="changeMode(NORMAL)"
      >
        Normal
      </button>
      <button
        :class="{ active: isModeActive(RECTANGLE) }"
        @click="changeMode(RECTANGLE)"
      >
        Rectangle
      </button>
      <button
        :class="{ active: isModeActive(ELLIPSE) }"
        @click="changeMode(ELLIPSE)"
      >
        Ellipse
      </button>
    </div>
    <canvas id="editor" height="600" width="700"></canvas>
  </div>
</template>

<style scoped>
@import './Editor.css';
</style>

<script lang="ts" src="./Editor.ts"></script>
