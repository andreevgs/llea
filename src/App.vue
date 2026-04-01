<template>
  <v-app>
    <app-bar></app-bar>
    <v-main class="container pa-6">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
import AppBar from "@/components/AppBar.vue";
</script>
<style>
.container {
  margin-top: 64px;
}
</style>
