# PlayQ Playwright Framework
# Playwright (TS binding) + Cucumber (BDD)
	  1. Modular Architecture (Clean Separation of Concerns)
	    •	Clear separation between actions (webActions, d365CRM), hooks, step definitions, and utilities.
	    •	This modular approach makes it easy to extend and maintain.
	  2. Comprehensive Locator Strategy
	    •	Supports multiple locator sources, including XPath, CSS, resource-based locators (loc.ts and loc.json), and pattern matching.
	    •	Dynamic locator resolution using resolveLocator() is impressive.
	  3. Flexible Configuration
      •	Environment Handling (env.ts, .env support)
      •	Pattern Matching for DOM element selection
      •	Centralized variable management through vars.ts
	  4. Advanced Test Features
      •	Step Parameterization: Custom {param} handling with parameterHook.ts.
      •	Embedded Logging: Custom step logging and attachments.
      •	Dynamic Data Handling: Integration with Faker and variable resolution.
	  5. Custom Report Generation
      •	Integrated with multiple-cucumber-html-reporter.
      •	Custom JSON preprocessing to enhance report readability.
	  6. Resilient Test Execution
      •	Parallel execution, retries, and reruns.
      •	Strong error handling for flaky UI tests.

Cucumber is a popular behavior-driven development (BDD) tool that allows developers and stakeholders to collaborate on defining and testing application requirements in a human-readable format. 
TypeScript is a powerful superset of JavaScript that adds optional static typing, making it easier to catch errors before runtime. By combining these two tools, we can create more reliable and maintainable tests.

## Features

1. Awesome report with screenshots, videos & logs
2. Execute tests on multiple environments 
3. Parallel execution
4. Rerun only failed features
5. Retry failed tests on CI
6. Github Actions integrated with downloadable report
7. Page object model

## Sample report
![image](https://github.com/ortoniKC/Playwright_Cucumber_TS/assets/58769833/da2d9f5a-85e7-4695-8ce2-3378b692afc4)


## Project structure

- .github -> yml file to execute the tests in GitHub Actions
- src -> Contains all the features & Typescript code
- test-results -> Contains all the reports related file

## Reports

1. [Mutilple Cucumber Report](https://github.com/WasiqB/multiple-cucumber-html-reporter)
2. Default Cucumber report
3. [Logs](https://www.npmjs.com/package/winston)
4. Screenshots of failure
5. Test videos of failure
6. Trace of failure

## Get Started

### Setup:

1. Clone or download the project
2. Extract and open in the VS-Code
3. `npm i` to install the dependencies
4. `npx playwright install` to install the browsers
5. `npm run test` to execute the tests
6. To run a particular test change  
```
  paths: [
            "src/test/features/featurename.feature"
         ] 
```
7. Use tags to run a specific or collection of specs
```
npm run test --TAGS="@test or @add"
```

### Folder structure
0. `src\pages` -> All the page (UI screen)
1. `src\test\features` -> write your features here
2. `src\test\steps` -> Your step definitions goes here
3. `src\hooks\hooks.ts` -> Browser setup and teardown logic
4. `src\hooks\pageFixture.ts` -> Simple way to share the page objects to steps
5. `src\helper\env` -> Multiple environments are handled
6. `src\helper\types` -> To get environment code suggestions
7. `src\helper\report` -> To generate the report
8. `config/cucumber.js` -> One file to do all the magic
9. `package.json` -> Contains all the dependencies
10. `src\helper\auth` -> Storage state (Auth file)
11. `src\helper\util` -> Read test data from json & logger

## Tutorials
1. Learn Playwright - [Playwright - TS](https://youtube.com/playlist?list=PL699Xf-_ilW7EyC6lMuU4jelKemmS6KgD)
2. BDD in detail - [TS binding](https://youtube.com/playlist?list=PL699Xf-_ilW6KgK-S1l9ynOnBGiZl2Bsk)


## Pattern
1. Sample `{{form::test1}} {address::test2} Street Address[1]`
    `{{<location name>::<location value>}} {<section name>::<section value>} Street Address[<Instance>]`

2. Faker is added via global


## Vars
  ${config.XXXXX} 
  ${vars.XXXXX} 
  ${env.XXXXX} 


## Executions
  > TAGS="@test_2" ENV="PROD" npm run test:tag

## VS Code Plugin
  "cucumberautocomplete.steps": [
        "tests/step-definitions/**/*.ts",
        "test/steps/**/*.ts",
        "test/steps/*.ts",
        "src/helper/addons/steps/*.ts",
        "src/helper/actions/steps/**/*.ts",
      ],
      "cucumberautocomplete.syncfeatures": 
    "test/features/**/*.feature, test/features/*.feature",

## Step Group
  All Step Groups should be within _step_group directory inside test/featues
  Extension of he files should be 
    <some name>.steps.feature (or)
    <some name>.step.feature (or)
    <some name>.sg.feature (or)
    <some name>.steps.sg.feature