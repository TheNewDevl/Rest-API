module.exports = {
  automock: true,

  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",


  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],

  testMatch: [
    "**/src/**/*.test.(ts|js)"
  ],

  testPathIgnorePatterns: [
    "/dist/"
  ],

  //A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  // transformIgnorePatterns: [
  //   "/node_modules/",
  //   "\\.pnp\\.[^\\/]+$"
  // ],

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,
};
