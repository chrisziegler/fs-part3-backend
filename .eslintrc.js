module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'arrow-spacing': ['error', { after: true, before: true }],
    eqeqeq: 'error',
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    'no-console': 0,
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
}
