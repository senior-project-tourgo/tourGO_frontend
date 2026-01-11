// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      '.expo/**',
      'node_modules/**',
      'build/**',
      'bin/**',
      'ezpo-env.d.ts',
      'nativewind-env.d.ts',
      'package-lock.json',
      'ios/**',
      'android/**'
    ]
  }
]);
