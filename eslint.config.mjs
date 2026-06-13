import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import { defineConfig, globalIgnores } from "eslint/config"

const FORMIK_IMPORT_MESSAGE =
  "Import form primitives from @/core/hooks instead. Only core/hooks may depend on formik — see docs/forms.md."
const TEMPORAL_IMPORT_MESSAGE =
  "Import date helpers from @/core/dates instead. Direct Temporal polyfill usage is not allowed."

const MAX_LINES_PER_COMPONENT = 500

const restrictedImportPaths = [
  { name: "formik", message: FORMIK_IMPORT_MESSAGE },
  { name: "temporal-polyfill", message: TEMPORAL_IMPORT_MESSAGE },
]
const restrictedImportPatterns = [
  { group: ["formik/*"], message: FORMIK_IMPORT_MESSAGE },
  { group: ["temporal-polyfill/*"], message: TEMPORAL_IMPORT_MESSAGE },
]

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["app/**/*.tsx"],
    ignores: ["core/components/ui/**"],
    rules: {
      "max-lines": [
        "warn",
        {
          max: MAX_LINES_PER_COMPONENT,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    rules: {
      semi: ["error", "never"],
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: false,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      // Forms: formik is encapsulated behind @/core/hooks. Nothing else may import it.
      // Dates: temporal-polyfill is encapsulated behind @/core/dates.
      "no-restricted-imports": [
        "error",
        {
          paths: restrictedImportPaths,
          patterns: restrictedImportPatterns,
        },
      ],
      // Allow props destructured purely to strip them from a `...rest` spread.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  // The abstraction layers are the only places allowed to depend on formik/temporal-polyfill.
  {
    files: ["core/dates/**/*.ts", "core/hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Playwright test artifacts:
    "playwright-report/**",
    "test-results/**",
    // Jest config (needs CommonJS):
    "jest.config.js",
    // Claude worktrees (managed by IDE, not project source):
    ".claude/**",
  ]),
])

export default eslintConfig
