import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // 1. GLOBAL IGNORES (Artifacts & Configs)
  {
    ignores: [
      '**/node_modules/**',
      'test-results/',
      'playwright-report/',
      'allure-*/',
      'ortoni-report/',
      'eslint.config.mjs',
      'playwright/.cache/',
    ],
  },

  // 2. BASE CONFIGS
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Use Type-Aware linting for better architecture
  prettierConfig, // Disables formatting rules that conflict with Prettier

  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },

  // 3. PLAYWRIGHT RULES (Tests only)
  {
    files: ['**/*.{spec,test}.ts'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/no-skipped-test': 'warn',
    },
  },

  // 4. ARCHITECT & LOGIC RULES (All TS files)
  {
    files: ['**/*.ts'],
    rules: {
      // Logic & Safety
      '@typescript-eslint/no-floating-promises': 'error', // Essential for async Playwright
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/require-await': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      'curly': 'error',
    },
  },
);
