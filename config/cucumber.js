module.exports = {
    default: {
        tags: process.env.npm_config_TAGS || "",
        formatOptions: {
            snippetInterface: "async-await"
        },
        paths: [
            // "./test/features/**/*.feature",
             "./_TEMP/execution/**/*.feature"
        ],
        dryRun: false,
        require: [
            "ts-node/register", // <-- Should be in top
            "tsconfig-paths/register",  // <-- added to enable path aliasing
            "./src/global.ts", // Should be belore the steps and hooks
            "./test/steps/**/*.ts",
            "./src/hooks/hooks.ts",
            "./test/steps/debug.steps.ts",
             "./src/hooks/stepHook.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:@rerun.txt"
        ],
        parallel: 1
    },
    rerun: {
        formatOptions: {
            snippetInterface: "async-await"
        },
        dryRun: false,
        require: [
            "ts-node/register",
            "tsconfig-paths/register",  // <-- added for rerun profile as well
            "./test/steps/**/*.ts",
            "./src/hooks/hooks.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:@rerun.txt"
        ],
        parallel: 2
    }
}