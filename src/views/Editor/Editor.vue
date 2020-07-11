<template>
  <div class="container">
    <div v-if="uploadImage" id="upload-image">
      <p>Upload your image</p>
      <input type="file" accept="image/jpeg" @change="onUploadImage" />
    </div>
    <template v-else>
      <div class="flex-container">
        <div class="editor-space">
          <div class="tools">
            <button :class="{ active: editorMode === 0 }" @click="editorMode = 0">Select</button>
            <button :class="{ active: editorMode === 1 }" @click="editorMode = 1">Rectangle</button>
            <button :class="{ active: editorMode === 2 }" @click="editorMode = 2">Ellipse</button>
            <button :class="{ active: editorMode === 3 }" @click="editorMode = 3">Polygon</button>
          </div>
          <div id="konva-stage"></div>
        </div>
        <div class="labeling-space">
          <h2 class="heading">Labeled Images</h2>
          <div class="labeled-image-list">
            <template v-if="labeledImage.length > 0">
              <div v-for="(image, index) in labeledImage" :key="index">
                <p>
                  Label:
                  <b>{{image.label}}</b>
                </p>
                <img
                  class="preview-img"
                  :src="image.url"
                  :height="image.height"
                  :width="image.width"
                />
                <hr />
              </div>
            </template>
            <template v-else>No labeled image.</template>
          </div>
        </div>
        <div class="labeling-space">
          <template v-if="previewImage.url.length !== 0">
            <img
              class="preview-img"
              :src="previewImage.url"
              :height="previewImage.height"
              :width="previewImage.width"
            />
            <p>Input label for this image</p>
            <form @submit="addLabel">
              <input type="text" v-model="labelInput" minlength="1" required />
              <button type="submit">Add</button>
            </form>
          </template>
          <template v-else>
            <p>No preview image</p>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import './Editor.css';
</style>

<script lang="ts" src="./Editor.ts"></script>
