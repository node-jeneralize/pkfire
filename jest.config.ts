import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+//ts$': 'ts-jest',
  },
  testMatch: ['/**/*.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
};

export default config;
