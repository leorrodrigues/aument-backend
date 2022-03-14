const { isConstructSignatureDeclaration } = require('typescript');
const config = require('./config');

const seconds = 1000

config.coverageThreshold = {
    global: {
        branches: 99.5,
        functions: 99.5,
        lines: 99.6,
        statements: -10
    },
}

config.testTimeout = 30 * seconds

module.exports = config;
