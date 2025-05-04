import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import eslintPluginStylistic from '@stylistic/eslint-plugin-ts';
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
    {
      files: ['**/*.ts'],
      plugins: {
        '@stylistic': eslintPluginStylistic,
      },
      rules: {
        '@stylistic/padding-line-between-statements': [
          'error',
          {
            blankLine: 'always',
            prev: '*',
            next: '*',
          },
        ],
      },
    },
    eslintPluginPrettier,
  ]),
  ...tseslint.configs.recommended,
];
