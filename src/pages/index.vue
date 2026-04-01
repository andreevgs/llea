<template>
  <h3 class="text-h3">Main</h3>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(() => {
  localStorage.setItem("visitedBefore", "true");
});
</script>
