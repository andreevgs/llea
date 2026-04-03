<template>
  <v-app>
    <app-bar />
    <v-main class="container pa-6">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import AppBar from "@/components/AppBar.vue";
</script>
<style>
.container {
  margin-top: 64px;
}
</style>
