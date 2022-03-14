module.exports = {
    env: {
        es2021: true,
        node: true,
        jest: true,
    },
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'class-methods-use-this': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                ts: 'never',
            },
        ],
        'no-param-reassign': [2, { props: false }],
        '@typescript-eslint/interface-name-prefix': [
            'error',
            {
                prefixWithI: 'always',
            },
        ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '_',
            },
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'consistent-return': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-console': 'off',
        'no-underscore-dangle': 'off'
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
};
