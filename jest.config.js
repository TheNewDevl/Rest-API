module.exports = {
  //automock: true,
  testEnvironment: 'node',
  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],
  forceExit: true,

  testMatch: [
    "**/src/**/*.test.(ts|js)"
  ],

  testPathIgnorePatterns: [
    "/dist/",
    "/node_modules/"
  ],
  preset: "ts-jest",
  verbose: true,
};
