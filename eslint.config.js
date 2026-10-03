import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";

export default defineConfig(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "**/*.d.ts",
      "public/**",
    ],
  },

  // Base JS & TS configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Vue 3
  ...pluginVue.configs["flat/essential"],

  // Stylistic formatting (replacing Prettier completely)
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: true,
    jsx: true,
    braceStyle: "1tbs",
    arrowParens: false, // "as-needed"
    commaDangle: "always-multiline",
    quoteProps: "consistent-as-needed",
  }),

  // Global environment
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Vue SFC specific rules
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      // Indentation matching vueIndentScriptAndStyle from former .prettierrc
      "@stylistic/indent": "off",
      "vue/script-indent": ["warn", 2, { baseIndent: 1, switchCase: 1 }],
      "vue/html-indent": ["warn", 2],
      "vue/html-quotes": ["warn", "double"],
    },
  },

  // Config files running in Node
  {
    files: ["*.config.{js,ts,mts}", "vite.config.mts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
