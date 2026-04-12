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
</template>

<script lang="ts" setup>
  const model = defineModel<boolean>();

  const handleImport = () => {
    console.log("Import");
  }

  const handleExport = () => {
    console.log("Export");
  }

  const handleDelete = () => {
    console.log("Delete");
  }
</script>

<style scoped></style>
