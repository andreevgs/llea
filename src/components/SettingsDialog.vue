<template>
  <v-dialog v-model="model" style="max-width: 500px">
    <v-card>
      <div>
        <v-toolbar dark>
          <v-btn dark icon @click="model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t('settings.header') }}</v-toolbar-title>
        </v-toolbar>
        <v-list lines="two">
          <v-list-subheader>{{ $t('settings.data_management') }}</v-list-subheader>
          <v-list-item
            key="import"
            :subtitle="$t('settings.import.subtitle')"
            :title="$t('settings.import.title')"
            @click="handleImportClick"
          >
            <template #prepend>
              <v-icon icon="mdi-download" />
            </template>
          </v-list-item>
          <v-list-item
            key="export"
            :disabled="isExporting"
            :subtitle="$t('settings.export.subtitle')"
            :title="$t('settings.export.title')"
            @click="exportData"
          >
            <template #prepend>
              <v-icon icon="mdi-upload" />
            </template>
          </v-list-item>
          <v-list-item
            key="delete_all"
            class="text-error"
            :title="$t('settings.delete_all.title')"
            @click="handleDeleteClick"
          >
            <template #prepend>
              <v-icon color="error" icon="mdi-delete" />
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
  </v-dialog>

  <DeleteConfirmDialog v-model="showConfirmDelete" @confirm="onConfirmDelete" />

  <input
    ref="fileInput"
    accept=".llea"
    style="display: none"
    type="file"
    @change="onFileSelected"
  >
</template>

<script lang="ts" setup>
  import { ref } from "vue";
  import { useDataManagement } from "@/composables/useDataManagement";
  import DeleteConfirmDialog from "./DeleteConfirmDialog.vue";

  const model = defineModel<boolean>();
  const showConfirmDelete = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  const { isExporting, exportData, importData, clearAllData } = useDataManagement();

  const handleImportClick = () => {
    fileInput.value?.click();
  };

  const onFileSelected = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const success = await importData(file);
    if (success) {
      model.value = false;
    }

    (event.target as HTMLInputElement).value = "";
  };

  const handleDeleteClick = () => {
    model.value = false;
    showConfirmDelete.value = true;
  };

  const onConfirmDelete = async () => {
    const success = await clearAllData();
    if (success) {
      showConfirmDelete.value = false;
    }
  };
</script>

<style scoped></style>
