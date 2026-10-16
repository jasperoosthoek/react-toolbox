module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    // react-dnd and its dependencies are published as ESM only
    '^.+/node_modules/(react-dnd|dnd-core|@react-dnd|react-dnd-test-backend)/.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(react-dnd|dnd-core|@react-dnd|react-dnd-test-backend)/)'],
  testMatch: [
    '<rootDir>/__tests__/**/*.test.(ts|tsx|js)',
    '<rootDir>/src/**/*.test.(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.ts']
};
