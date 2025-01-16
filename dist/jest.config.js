"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    clearMocks: true,
    coverageProvider: 'v8',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    roots: ['<rootDir>'],
    transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '**/*.test.ts',
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)'
    ],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    }
};
