module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|svg|webp|avif|ico)$': '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      //"^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/',
    ],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json', 
      },
    },
  };