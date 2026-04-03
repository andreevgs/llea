import vuetify from "eslint-config-vuetify";

export default vuetify(
  {
    ts: true,
  },
  {
    rules: {
      "@stylistic/quotes": [
        "warn",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: "always",
        },
      ],
      "@stylistic/semi": "off",
      "@stylistic/space-before-function-paren": "off",
      "@stylistic/arrow-parens": "off",
      "@stylistic/member-delimiter-style": "off",
      "curly": "off",
      "unicorn/no-array-reverse": "off",
      "antfu/top-level-function": "off",
      "indent": "off",
      "unicorn/prefer-add-event-listener": "off",
    },
  },
);
