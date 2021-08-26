module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {}
    },
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
    env: {
        browser: true,
        node: true,
        jest: true,
        es6: true
    },
    rules: {
        'prettier/prettier': ['warn'],
        'no-console': 'off',
        semi: 'warn',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
    }
};
