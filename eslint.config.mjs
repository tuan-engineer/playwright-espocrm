import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Ignore dependencies, generated outputs, cache, and config file from linting
  {
    ignores: [
      '**/node_modules/**',
      'test-results/',
      'reports/',
      'eslint.config.mjs',
      'playwright/.cache/',
    ],
  },
  // Use ESLint's recommended ruleset (best-practice defaults)
  eslint.configs.recommended,
  // Scoped to .ts files only to avoid parsing errors on non-TS files
  {
    files: ['**/*.ts'],
    // Enable TypeScript ESLint rules that require type-checking (more strict, uses tsconfig)
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: {
        // Include Node.js global variables (e.g., process, process.cwd(), module)
        ...globals.node,
        // Removed globals.jest — not applicable in a Playwright project
      },
      parserOptions: {
        // Let @typescript-eslint automatically use tsconfig for faster, type-aware linting (no manual project path needed)
        projectService: true,
        // Set the root directory for tsconfig resolution (based on current config file location)
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Warns when passing an 'any' value as an argument to a function (helps catch type safety issues)
      '@typescript-eslint/no-unsafe-call': 'warn',
      // Warns when accessing a property/method of an 'any' value (prevents potential runtime errors)
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      // Warns when returning an 'any' value from a function with a specific return type (risks breaking type safety)
      '@typescript-eslint/no-unsafe-return': 'warn',
      // Warns when passing an 'any' value as an argument to a function (risks runtime errors)
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // Warn when using `any` type (loses type safety; prefer specific types or unknown)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disables warning when assigning values of type 'any' to variables (loses type safety)
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      // Warn if you forget to await or handle a Promise (async code may run unexpectedly)
      '@typescript-eslint/no-floating-promises': 'warn',
      // Warn when using await on a non-Promise value (likely a mistake)
      '@typescript-eslint/await-thenable': 'warn',
      // Warn if you misuse Promises (e.g., pass async fn where sync expected); ignore cases where return is intentionally not awaited (checksVoidReturn: false)
      '@typescript-eslint/no-misused-promises': ['warn', { checksVoidReturn: false }],
      // Warn if a condition is pointless because the value can never be null/undefined/false based on its type
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      // Warn on unused variables/args/errors, except ones starting with "_" (intentionally ignored)
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      // Warn to use `import type` for types instead of regular imports (cleaner, avoids runtime impact)
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      // Warn if an async function has no await (async may be unnecessary)
      '@typescript-eslint/require-await': 'warn',
      // Turn off warning when putting non-string values into template strings (e.g., number, object)
      '@typescript-eslint/restrict-template-expressions': 'off',
      // Warn to always use `return await` in async functions (ensures proper error handling)
      '@typescript-eslint/return-await': ['warn', 'always'],
      // Allow using console.* (no warnings for console.log, console.error, etc.)
      'no-console': 'off',
      // Warn to use ===/!== instead of ==/!=, except allow == null to check null or undefined
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
      // Warn if control statements (if/for/while, etc.) don't use {} braces (always require curly braces)
      'curly': ['warn', 'all'],
    },
  },
  {
    // Apply this config only to test files (*.spec.ts, *.test.ts)
    files: ['**/*.{spec,test}.ts'],
    // Register Playwright plugin to enable its custom linting rules
    plugins: { playwright },
    rules: {
      // Apply Playwright's recommended ESLint rules (flat config format)
      ...playwright.configs['flat/recommended'].rules,
      // Warn when using waitForTimeout (discouraged, use proper waits instead)
      'playwright/no-wait-for-timeout': 'warn',
      // Warn when using page.pause() (should not be committed in tests)
      'playwright/no-page-pause': 'warn',
      // Warn on focused tests (e.g., test.only) to prevent accidental commits
      'playwright/no-focused-test': 'warn',
      // Warn against relying on networkidle (can be flaky; prefer explicit waits)
      'playwright/no-networkidle': 'warn',
      // Warn on skipped tests (e.g., test.skip) to avoid unintentionally ignoring tests
      'playwright/no-skipped-test': 'warn',
      // Warn when expect assertions are invalid or missing proper awaits
      'playwright/valid-expect': 'warn',
      // Warn to use Playwright's expect(locator).toBe... (auto-waits) instead of manual checks/assertions
      'playwright/prefer-web-first-assertions': 'warn',
    },
  },
  // Apply Prettier formatting rules and disable conflicting ESLint rules — MUST be last
  prettierConfig,
);
