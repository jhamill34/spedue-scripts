import { Linter } from 'eslint'

function configure(): Linter.Config {
  return {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
      'plugin:testing-library/react',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:jsx-a11y/recommended',
    ],
    env: {
      browser: true,
      jest: true,
      node: true,
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ['react-hooks', 'emotion', 'eslint-plugin-tsdoc'],
    rules: {
      'emotion/jsx-import': 'error',
      'emotion/no-vanilla': 'error',
      'emotion/import-from-emotion': 'error',
      'emotion/styled-import': 'error',
      'emotion/syntax-preference': [2, 'object'],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/order': 'error',
      'func-style': ['error', 'declaration'],
      'tsdoc/syntax': 'error',
      'react/jsx-sort-props': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
}

export = configure()
