<template>
  <v-row class="mb-2" density="compact">
    <v-col cols="12">
      <v-alert color="primary" type="info" variant="tonal">
        <template #text>
          <span>
            Скопируй промпт и вставь его в генеративную нейросеть (<b>Google Gemini</b>
            или <b>Qwen</b>), затем скопируй полученный результат и
            вставь его сюда.
          </span>
        </template>
      </v-alert>
    </v-col>
    <v-col cols="6">
      <v-btn
        block
        :color="copyPromptColor"
        :prepend-icon="copyPromptIcon"
        variant="tonal"
        @click="handleCopyPrompt"
      >
        {{ copyPromptText }}
      </v-btn>
    </v-col>
    <v-col cols="6">
      <v-btn
        block
        :color="pasteResultColor"
        :disabled="Boolean(model)"
        :prepend-icon="pasteResultIcon"
        variant="tonal"
        @click="handlePasteResult"
      >
        {{ pasteResultText }}
      </v-btn>
    </v-col>
  </v-row>

  <v-sheet border rounded>
    <v-toolbar density="compact">
      <span class="text-subtitle-1 ml-4">
        {{ toolbarText }}
      </span>
      <v-spacer />
      <v-btn
        v-if="Boolean(model)"
        class="text-none mr-4"
        color="error"
        density="comfortable"
        prepend-icon="mdi-delete"
        variant="tonal"
        @click="model = null"
      >
        Очистить
      </v-btn>
    </v-toolbar>
    <pre class="pa-4 ma-0 preview">{{ model || prompt }}</pre>
  </v-sheet>
</template>

<script lang="ts" setup>
  import { computed, ref } from "vue";

  const model = defineModel<string | null>({ default: null });

  const props = defineProps<{
    prompt: string;
  }>();

  const isPromptCopied = ref(false);

  const copyPromptText = computed(() => {
    return isPromptCopied.value ? "Скопировано" : "Скопировать";
  });

  const toolbarText = computed(() => {
    return model.value ? "Результат" : "Промпт";
  });

  const copyPromptIcon = computed(() => {
    return isPromptCopied.value
      ? "mdi-check"
      : "mdi-clipboard-text-multiple-outline";
  });

  const copyPromptColor = computed(() => {
    return isPromptCopied.value ? "success" : "inherit";
  });

  const pasteResultText = computed(() => {
    return model.value ? "Результат записан" : "Вставить результат";
  });

  const pasteResultIcon = computed(() => {
    return model.value ? "mdi-check" : "mdi-clipboard-text-outline";
  });

  const pasteResultColor = computed(() => {
    return model.value ? "success" : "inherit";
  });

  const handlePasteResult = async () => {
    try {
      const pastedText = await navigator.clipboard.readText();
      JSON.parse(pastedText);
      model.value = pastedText;
    } catch {
    //
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(props.prompt).then(() => {
      isPromptCopied.value = true;
      setTimeout(() => (isPromptCopied.value = false), 2000);
    });
  };
</script>

<style scoped>
.preview {
  height: 224px;
  max-height: 224px;
  overflow: auto;
}
</style>
