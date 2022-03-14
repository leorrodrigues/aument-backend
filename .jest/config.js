require('reflect-metadata');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env.test') });

module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  rootDir: '../',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/node_modules',
    '!<rootDir>/src/**/env.ts',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/**/seeds*/**/*.ts',
    '!<rootDir>/src/**/migrations/**/*.ts',
    '!<rootDir>/src/main/server.ts',
    '!<rootDir>/src/main/graphql/**/*.ts',
    '!<rootDir>/src/domain/models/**/*.ts',
    '!<rootDir>/src/main/config/MongooseManager.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1',
  },
  setupFiles: ["dotenv/config"],
};
