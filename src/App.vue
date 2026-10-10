<template>
  <v-app>
    <app-bar />
    <v-main class="container pa-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import AppBar from "@/components/common/AppBar.vue";
</script>
<style>
.container {
  margin-top: 64px;
}

.v-container {
  max-width: 960px !important;
}
</style>
