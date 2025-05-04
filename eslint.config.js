import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
  ...defineConfig([
    {
      files: ['**/*.{js,mjs,cjs,ts}'],
      plugins: { js },
      extends: ['js/recommended'],
    },
    {
      files: ['**/*.{js,mjs,cjs,ts}'],
      languageOptions: { globals: globals.browser },
    },
    {
      files: ['**/*.json'],
      plugins: { json },
      language: 'json/json',
      extends: ['json/recommended'],
    },
    eslintPluginPrettier,
  ]),
  ...tseslint.configs.recommended,
];
