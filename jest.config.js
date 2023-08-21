/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['config'],
  globals: {
    'ts-jest': {
      tsconfig: './tests/jest.tsconfig.json'
    }
  },
  globalSetup: './tests/setup.ts',
};
