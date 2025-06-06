
module.exports = {
    default: {
        formatOptions: {
            snippetInterface: "async-await"
        },
        paths: [
             "./_TEMP/execution/**/*.feature"
        ],
        dryRun: false,
        require: [
            "ts-node/register", // <-- Should be in top
            "tsconfig-paths/register",  // <-- added to enable path aliasing
            "./src/global.ts", // Should be belore the steps and hooks
            "./test/steps/**/*.ts",
            "./src/helper/actions/web.ts",
            "./src/helper/addons/**/*.ts",
            "./src/helper/actions/*.ts",
            "./src/helper/actions/hidden/*.ts",
            "./src/hooks/hooks.ts",
             "./src/hooks/stepHook.ts"
        ],
        requireModule: [
            "ts-node/register",
            "tsconfig-paths/register"
        ],
        format: [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:@rerun.txt",
            // "dist/src/helper/report/CustomStepReporter.js"
        ],
        parallel: 1
    },
    // rerun: {
    //     formatOptions: {
    //         snippetInterface: "async-await"
    //     },
    //     dryRun: false,
    //     require: [
    //         "ts-node/register",
    //         "tsconfig-paths/register",  // <-- added for rerun profile as well
    //         "./test/steps/**/*.ts",
    //         "./src/hooks/hooks.ts"
    //     ],
    //     requireModule: [
    //         "ts-node/register"
    //     ],
    //     format: [
    //         "progress-bar",
    //         "html:test-results/cucumber-report.html",
    //         "json:test-results/cucumber-report.json",
    //         "rerun:@rerun.txt"
    //     ],
    //     parallel: 2
    // }
}