module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.ts'],
  testMatch: ['**/?(*.)+(test|spec).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx']
};
