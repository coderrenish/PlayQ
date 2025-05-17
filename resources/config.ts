// This is framework config file

import { version } from "winston";

export const config = {
  timeout: "30000", // Excepted: numeric (milliseconds). Default: 30000 milliseconds (30 seconds)
  patternConfig: "lambdatest",
  baseUrl: "https://your-app.com", // Excepted: Any url. Default: Blank
  browser: {
    session: "default", // Type: each. Default: "default"
  },
  artifacts: {
    screenshot: true, // Expected: Boolean only. Default: false
    video: true, // Excepted: Boolean only. Default: false
    trace: true, // Excepted: Boolean only. Default: false
    onFailureOnly: true, // Expected: Boolean only. Default: true (false: Will capture on all test cases)
    onSuccessOnly: false, // Expected: Boolean only. Default: false
    cleanUpBeforeRun: true, // Expected: Boolean only. Default: false ✅ 
  },
  testExecution: {
    retryOnFailure: true, // Expected: Boolean only. Default: false
    parallel: true, // Expected: Boolean only. Default: false
    maxInstances: 5, // Expected: numeric only. Default: 5
    maxRetries: 2, // Expected: numeric only. Default: 0
    retryDelay: 1000, // Expected: numeric only. Default: 1000 milliseconds (1 second)
    retryInterval: 5000, // Expected: numeric only. Default: 5000 milliseconds (5 seconds)
    retryTimeout: 30000, // Expected: numeric only. Default: 30000 milliseconds (30 seconds)
    order: "sequential", // Expected: "sequential" or "random". Default: "sequential"
  },
  d365CRM: {
    version: "v9.2", // Expected: "v9.2" or "v9.2.nl". Default: "v9.2"
  },

  featureFlags: {
    enableBetaUI: true,
    useMockBackend: false
  },
  supportedLanguages: ["en", "fr", "es"]
};