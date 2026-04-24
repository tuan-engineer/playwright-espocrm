import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // 1. GLOBAL IGNORES: Exclude build artifacts, reports, and system caches
  {
    ignores: [
      '**/node_modules/**',
      'test-results/',
      'reports/',
      'eslint.config.mjs',
      'playwright/.cache/',
    ],
  },
  // 2. BASE CONFIGS: Standard recommended rules for JS and TS
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Enables Type-Aware linting for deep logic analysis
  prettierConfig, // Disables formatting rules that conflict with Prettier
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname, // Improves performance by explicitly defining the project root
      },
    },
  },
  // 3. PLAYWRIGHT RULES: Specialized rules for E2E testing stability
  {
    files: ['**/*.{spec,test}.ts'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-page-pause': 'warn',
      'playwright/no-focused-test': 'warn',
      'playwright/no-networkidle': 'warn',
      'playwright/no-skipped-test': 'warn',
      'playwright/valid-expect': 'warn',        // Ensures 'expect' is used correctly with await
      'playwright/prefer-web-first-assertions': 'warn', // Encourages auto-retrying assertions
    },
  },
  // 4. ARCHITECT & LOGIC RULES: Enhancing code quality and error prevention
  {
    files: ['**/*.ts'],
    rules: {
      // --- LOGIC & SAFETY (Warnings to prevent silent failures) ---
      '@typescript-eslint/no-floating-promises': 'warn', // Detects unawaited promises
      '@typescript-eslint/await-thenable': 'warn',       // Warns when awaiting non-promise values
      '@typescript-eslint/no-misused-promises': ['warn', { checksVoidReturn: false }],
      '@typescript-eslint/no-unnecessary-condition': 'warn', // Flags logic that is always true/false
      // --- CODE CLEANLINESS ---
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',      // Discourages 'any' but doesn't block execution
      '@typescript-eslint/require-await': 'warn',        // Warns if an async function lacks await
      '@typescript-eslint/restrict-template-expressions': 'off', // Allows logging unknown/any in string templates
      // --- CODE STYLE & QUALITY ---
      'no-console': 'off',                               // Allows logging via console or Winston
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],  // Enforces strict equality (===)
      'curly': ['warn', 'all'],                          // Requires braces for all control blocks
      '@typescript-eslint/return-await': ['warn', 'always'], // Better stack traces for Playwright
    },
  },
);
