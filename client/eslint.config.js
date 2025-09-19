import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importX from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  globalIgnores([
    'dist',
    'eslint.config.js',
    '**/*.config.{js,ts,mjs,cjs}',
    'vite.config.{js,ts,mjs,cjs}',
    'postcss.config.{js,ts,mjs,cjs}',
    'tailwind.config.{js,ts,mjs,cjs}',
  ]),

  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  {
    files: ['eslint.config.js', 'vite.config.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        import: 'readonly',
      },
    },
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'simple-import-sort/imports': 'off',
      'import-x/no-unresolved': 'off',
    },
  },

  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'import-x': importX,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'src'],
        },
      },
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
      },
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'max-len': ['error', { code: 100, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],

      'simple-import-sort/imports': ['error', {
        groups: [
          ['^react$', '^react', '^next', '^@?\\w'],
          ['^type:'],
          ['^@/'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?!/?$)', '^\\./?$'],
          ['^.+\\.s?css$'],
        ],
      }],
      'simple-import-sort/exports': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': ['warn', { ignore: ['^/'] }],
      'import-x/named': 'warn',

      'no-unused-vars': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]);
