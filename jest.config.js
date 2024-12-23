const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // 指向 Next.js 应用的路径
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '@stylexjs/stylex': '<rootDir>/src/__mocks__/stylex.js',
  },
}

module.exports = createJestConfig(customJestConfig) 