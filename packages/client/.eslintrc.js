const rules = require("@burneeble/eslint-plugin-burneeble").rules;

const customRules = {};

Object.keys(rules).forEach((rule) => {
  customRules["@burneeble/burneeble/" + rule] = "error";
});

module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@burneeble/burneeble"],
  rules: {
    "n/no-missing-import": "off",
    "no-console": "off",
    "padding-line-between-statements": "off",
    "sort-imports": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    ...customRules,
  },
  ignorePatterns: ["dist/", ".eslintrc.js", "__tests__/"],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  parser: "@typescript-eslint/parser",
};
