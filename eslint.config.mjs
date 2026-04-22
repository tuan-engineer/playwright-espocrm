import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // ==========================================
  // 1. IGNORED FILES & DIRECTORIES
  // ==========================================
  {
    ignores: [
      'node_modules/',
      'test-results/',
      'playwright-report/',
      'playwright/.cache/',
      'eslint.config.mjs',
    ],
  },
  // ==========================================
  // 2. BASE CONFIGURATIONS
  // ==========================================
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  // Set up the environment and bridge to tsconfig.json for type-aware linting
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  // ==========================================
  // 3. PLAYWRIGHT CONFIG (Applied to test files only)
  // ==========================================
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    plugins: {
      playwright, // EXPLICITLY DECLARE THE PLUGIN HERE
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules, // Keep default rules
      // --- 🎭 MOVE ALL PLAYWRIGHT SPECIFIC RULES HERE ---
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'warn',
      'playwright/no-page-pause': 'error',
      'playwright/valid-expect': 'error',
      'playwright/expect-expect': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/no-conditional-in-test': 'warn',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
    },
  },
  // ==========================================
  // 4. ARCHITECT RULESET (Overrides for all .ts files)
  // ==========================================
  {
    files: ['**/*.ts'],
    rules: {
      // --- 🏗️ TYPESCRIPT & LOGIC ---
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/require-await': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      // --- ✨ FORMATTING ---
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
    },
  },
);
