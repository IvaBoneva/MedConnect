module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    Temporal: 'readonly',
  },
  extends: ['eslint:recommended'],
  plugins: ['react'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'no-empty': 'off',
    // Define any custom ESLint rules here
  },
};