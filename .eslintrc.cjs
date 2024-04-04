/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  // Base config
  extends: ['eslint:recommended'],

  overrides: [
    // TS
    {
      files: ['**/*.{ts,tsx}'],
      extends: ['standard-with-typescript', 'standard-jsx', 'standard-react', 'plugin:react/jsx-runtime', 'prettier'],
      parser: '@typescript-eslint/parser',
      settings: {
        'import/internal-regex': '^~/',
        'import/resolver': {
          node: {
            extensions: ['.ts', '.tsx'],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowString: true,
            allowNumber: true,
            allowNullableObject: true,
            allowNullableBoolean: false,
            allowNullableString: false,
            allowNullableNumber: false,
            allowNullableEnum: false,
            allowAny: false,
          },
        ],
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
          },
        ],
        'react/jsx-handler-names': [
          'error',
          {
            eventHandlerPrefix: 'handle',
            eventHandlerPropPrefix: false,
            checkLocalVariables: true,
            checkInlineFunction: true,
          },
        ],
        // Not sure if error or off.
        '@typescript-eslint/no-misused-promises': [
          'off',
          {
            checksVoidReturn: {
              arguments: false,
              attributes: false,
              properties: false,
            },
          },
        ],
      },
      overrides: [
        {
          files: ['**/*.d.ts'],
          rules: {
            // *.d.ts files need to be able to use any indexed object style
            '@typescript-eslint/consistent-indexed-object-style': ['off'],
          },
        },
      ],
    },

    // Node
    {
      files: ['.eslintrc.cjs'],
      env: {
        node: true,
      },
    },
  ],

  settings: {
    react: {
      version: 'detect',
    },
    formComponents: ['Form'],
    linkComponents: [
      { name: 'Link', linkAttribute: 'to' },
      { name: 'NavLink', linkAttribute: 'to' },
    ],
    'import/resolver': {
      typescript: {},
    },
  },
};
