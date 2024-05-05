
module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'tsx'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['<rootDir>/src/**/*.?(i)(test|spec).(ts|js|tsx)', '<rootDir>/test/**/*.?(i)(test|spec).(ts|js|tsx)'],
};
