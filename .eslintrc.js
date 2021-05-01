module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
  },
  extends: [
    'eslint:all', // basic
    'airbnb-typescript', // syntax
    'plugin:react/all', // react ?already in airbnb?
    'plugin:@typescript-eslint/all', // typescript
    // 'plugin:@typescript-eslint/all', // very slow :/
    'plugin:react-hooks/recommended', // react-hooks
    'plugin:testing-library/react', // react-testing-library
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-no-literals': 'off',
    'react/jsx-max-depth': 'off',
    'react/function-component-definition': [2, { namedComponents: 'function-declaration' }],
    'react/require-default-props':'off', // typescript will handle that
    '@typescript-eslint/object-curly-spacing': ["error", "always"],
    '@typescript-eslint/comma-dangle': ["error", "always-multiline"],
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/no-type-alias':['error', { "allowAliases": "always" }],
    'no-void': ["error", { "allowAsStatement": true }],
    'linebreak-style': 'off'

    // 'import/no-cycle': 'off', // slow performance
    // '@typescript-eslint/no-implied-eval': 'off', // very slow performance
    // '@typescript-eslint/no-unsafe-assignment': 'off', // very slow performance
    // '@typescript-eslint/no-confusing-void-expression': 'off', // very slow performance
    // '@typescript-eslint/promise-function-async': 'off', // very slow performance
    // '@typescript-eslint/no-unsafe-return': 'off', // very slow performance
    // '@typescript-eslint/unbound-method': 'off', // very slow performance
    // '@typescript-eslint/no-unsafe-member-access': 'off', // very slow performance
    // '@typescript-eslint/no-misused-promises': 'off', // very slow performance
    // '@typescript-eslint/no-unnecessary-condition': 'off', // very slow performance
    // '@typescript-eslint/strict-boolean-expressions': 'off', // very slow performance
    // '@typescript-eslint/no-base-to-string': 'off', // very slow performance
    // '@typescript-eslint/restrict-template-expressions': 'off', // very slow performance
    // '@typescript-eslint/no-floating-promises': 'off', // very slow performance
    // '@typescript-eslint/no-unsafe-call': 'off', // very slow performance
    // '@typescript-eslint/no-unnecessary-qualifier': 'off', // very slow performance
  },
};
