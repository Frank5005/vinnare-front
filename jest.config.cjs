module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|svg|webp|avif|ico)$': '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
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
        tsconfig: 'tsconfig.app.json', // o 'tsconfig.app.json' si prefieres
      },
    },
  };