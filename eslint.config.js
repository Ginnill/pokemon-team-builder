import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist'], // Ignora a pasta 'dist'
  },
  {
    extends: [
      js.configs.recommended, // Configuração básica do JavaScript
      'plugin:react/recommended', // Regras recomendadas para React
      'plugin:react-hooks/recommended', // Regras recomendadas para React Hooks
      'plugin:@typescript-eslint/recommended', // Regras recomendadas para TypeScript
    ],
    files: ['**/*.{ts,tsx}'], // Aplica às extensões TypeScript
    languageOptions: {
      ecmaVersion: 2020,
      parser: tsParser, // Parser para TypeScript
      globals: globals.browser, // Variáveis globais do ambiente de navegador
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': ts, // Plugin TypeScript
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // Regras recomendadas de React Hooks
      '@typescript-eslint/no-unused-vars': ['warn'], // Aviso para variáveis não utilizadas
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Desativa obrigatoriedade de tipos em exportações
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: 'detect', // Detecta automaticamente a versão do React
      },
    },
  },
];
