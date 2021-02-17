module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:all', // basic
    'airbnb', // syntax
    'plugin:react/all', // react
    'plugin:@typescript-eslint/all', // typescript
    'plugin:react-hooks/all', // react-hooks
    'plugin:testing-library/react', // react-testing-library
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
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
    'import/prefer-default-export': 'off',
    'react/jsx-no-literals': 'off',
    'react/jsx-newline': 'off',
    'react/jsx-max-depth': 'off',
    'react/function-component-definition': [2, { namedComponents: 'function-declaration' }],
  },
};
