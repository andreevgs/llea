<template>
  <v-dialog v-model="model" style="max-width: 500px">
    <v-card>
      <v-toolbar>
        <v-btn icon @click="model = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('settings.delete_confirm.header') }}</v-toolbar-title>
      </v-toolbar>
      <div class="pa-4">
        <span>{{ $t('settings.delete_confirm.text') }}</span>
        <v-btn
          class="mb-2 mt-4 w-100"
          color="error"
          type="submit"
          variant="tonal"
          @click="$emit('confirm')"
        >
          {{ $t('settings.delete_confirm.delete_btn') }}
        </v-btn>
        <v-btn
          class="w-100"
          color="primary"
          variant="tonal"
          @click="model = false"
        >
          {{ $t('settings.delete_confirm.cancel_btn') }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  const model = defineModel<boolean>();
  defineEmits(["confirm"]);
</script>
