<template>
  <v-dialog v-model="model" style="max-width: 500px">
    <v-card>
      <div>
        <v-toolbar dark>
          <v-btn dark icon @click="model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Настройки</v-toolbar-title>
        </v-toolbar>
        <v-list lines="two">
          <v-list-subheader>Управление данными</v-list-subheader>
          <v-list-item
            key="Импорт"
            subtitle="Импортировать данные из файла"
            title="Импорт"
            @click="handleImport"
          >
            <template #prepend>
              <v-icon icon="mdi-download" />
            </template>
          </v-list-item>
          <v-list-item
            key="Экспорт"
            :disabled="isExporting"
            subtitle="Экспортировать в файл все данные приложения"
            title="Экспорт"
            @click="handleExport"
          >
            <template #prepend>
              <v-icon icon="mdi-upload" />
            </template>
          </v-list-item>
          <v-list-item
            key="Удалить все данные"
            class="text-error"
            title="Удалить все данные приложения"
            @click="handleDelete"
          >
            <template #prepend>
              <v-icon color="error" icon="mdi-delete" />
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showConfirmDelete" style="max-width: 500px">
    <v-card>
      <v-card-title>Удаление данных</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="showConfirmDelete = false">Отмена</v-btn>
        <v-btn color="error" variant="text" @click="confirmDelete">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
  import { dictionaryEntriesService } from "@/services/dictionaryEntriesService";
  import { essaysService } from "@/services/essaysService";
  import { progressEntriesService } from "@/services/progressEntriesService";
  import { progressHistoryService } from "@/services/progressHistoryService";
  import { useEssaysStore } from "@/stores/essays";
  import { useLanguagesStore } from "@/stores/languages";
  import { useSystemStore } from "@/stores/system";

  const model = defineModel<boolean>();
  const languagesStore = useLanguagesStore();
  const systemStore = useSystemStore();

  const isExporting = ref(false);
  const showConfirmDelete = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  const handleImport = () => {
    fileInput.value?.click();
  };

  const onFileSelected = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const result = await file.text();
      const data = JSON.parse(result);

      if (data.dictionaryEntries) {
        for (const entry of data.dictionaryEntries) {
          await dictionaryEntriesService.put(entry);
        }
      }
      if (data.essays) {
        for (const entry of data.essays) {
          await essaysService.put(entry);
        }
      }
      if (data.progressEntries) {
        for (const entry of data.progressEntries) {
          await progressEntriesService.put(entry);
        }
      }
      if (data.progressHistory) {
        for (const entry of data.progressHistory) {
          await progressHistoryService.put(entry);
        }
      }

      if (data.currentLanguage) {
        languagesStore.setCurrentLanguage(data.currentLanguage);
      }
      if (data.targetLanguage) {
        languagesStore.setTargetLanguage(data.targetLanguage);
      }

      model.value = false;
      systemStore.triggerUpdate();
    } catch (error) {
      console.error(error);
    }

    (event.target as HTMLInputElement).value = "";
  };

  const handleExport = async () => {
    if (isExporting.value) return;
    isExporting.value = true;
    try {
      const data = {
        dictionaryEntries: await dictionaryEntriesService.getAll(),
        essays: await essaysService.getAll(),
        progressEntries: await progressEntriesService.getAll(),
        progressHistory: await progressHistoryService.getAll(),
        currentLanguage: languagesStore.currentLanguage,
        targetLanguage: languagesStore.targetLanguage,
      };
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.llea";
      document.body.append(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      isExporting.value = false;
    }
  };

  const handleDelete = () => {
    model.value = false;
    showConfirmDelete.value = true;
  };

  const confirmDelete = async () => {
    try {
      await dictionaryEntriesService.clear();
      await essaysService.clear();
      await progressEntriesService.clear();
      await progressHistoryService.clear();

      const essaysStore = useEssaysStore();
      essaysStore.newEssay = "";
      essaysStore.isNewEssayTranslatorUsed = false;

      showConfirmDelete.value = false;
      systemStore.triggerUpdate();
    } catch (error) {
      console.error(error);
    }
  };
</script>

<style scoped></style>
