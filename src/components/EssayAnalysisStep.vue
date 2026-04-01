<template>
  <v-row dense class="mb-1">
    <v-col cols="12">
      <v-alert type="info" color="primary" variant="tonal" closable>
        <template v-slot:text>
          <span>
            Скопируй промпт и вставь его в генеративную нейросеть (<b
              >Google Gemini</b
            >
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
        @click="handleCopyPrompt"
        variant="tonal"
      >
        {{ copyPromptText }}
      </v-btn>
    </v-col>
    <v-col cols="6">
      <v-btn
        block
        :color="pasteResultColor"
        :prepend-icon="pasteResultIcon"
        variant="tonal"
        :disabled="Boolean(model)"
        @click="handlePasteResult"
      >
        {{ pasteResultText }}
      </v-btn>
    </v-col>
  </v-row>

  <v-sheet rounded border>
    <v-toolbar density="compact">
      <span class="text-subtitle-1 ml-4">
        {{ toolbarText }}
      </span>
      <v-spacer></v-spacer>
      <v-btn
        v-if="Boolean(model)"
        prepend-icon="mdi-delete"
        class="text-none"
        density="comfortable"
        color="error"
        variant="tonal"
        @click="model = null"
      >
        Очистить
      </v-btn>
    </v-toolbar>
    <pre class="pa-4 preview">{{ model || prompt }}</pre>
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
  return isPromptCopied.value ? "скопировано" : "скопировать";
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
  return model.value ? "результат записан" : "вставить результат";
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
  } catch (e) {
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
