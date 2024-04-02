import path from "path";

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";
process.env.IS_TESTING = "true";
process.env.STAGE = "d1";

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  resolver: "<rootDir>/__tests__/resolver.js",
  testTimeout: 10000,
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        isolatedModules: true,
        tsconfig: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
        include: ["src/**/*", "tests/**/*"],
      },
    ],
  },
  globals: {},
  sandboxInjectedGlobals: ["Math"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "__tests__",
        outputName: "report.xml",
      },
    ],
  ],
};
