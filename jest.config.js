module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.(ts|tsx|js)',
    '<rootDir>/src/**/*.test.(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/setupTests.ts',
    '!src/index.ts',
    '!src/__tests__/**/*',
    '!src/examples/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts']
};
