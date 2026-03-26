/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {},
  setupFiles: ['./jest.setup.js'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/database/seed.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000
};
