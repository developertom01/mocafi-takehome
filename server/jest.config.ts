import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    verbose: true,
    testEnvironment: "node",
    testMatch: process.env.CI? ["**/src/**/*.test.ts"]: ["**/*.test.ts"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
  };
};
