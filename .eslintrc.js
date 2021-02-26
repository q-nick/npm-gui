module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:all', // basic
    'airbnb', // syntax
    'plugin:@typescript-eslint/all', // typescript
    'plugin:react/all', // react
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
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/react-in-jsx-scope': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-no-literals': 'off',
    'react/jsx-newline': 'off',
    'react/jsx-max-depth': 'off',
    'react/function-component-definition': [2, { namedComponents: 'function-declaration' }],
    'react/require-default-props':'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/no-extra-parens': 'off',
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/no-type-alias':['error', { "allowAliases": "always" }],
    'no-void': ["error", { "allowAsStatement": true }]
  },
};
