// https://jestjs.io/docs/zh-Hans/configuration#testurl-string

module.exports = {
    rootDir: './packages',
    preset: "ts-jest/presets/js-with-babel",
    //指示是否应在运行期间报告每个测试
    verbose: false,
    testURL: "http://poorman.top?a=100&b=200",
    testEnvironment: "jsdom",
    testEnvironmentOptions: {},
    collectCoverage: true,
    // coverageReporters: ["json", "html"],
    coverageDirectory: "../coverage/",
    collectCoverageFrom: [
        '*/src/**/*.ts', // 注意rootDir指定了，请正确输入目录
        '!*/src/index.ts',
        "!**/node_modules/**"
    ],
    globals: {
        __DEV__: process.env.NODE_ENV !== 'production',
    }
}
