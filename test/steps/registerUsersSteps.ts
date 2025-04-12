import { test, expect, Page, BrowserContext, chromium } from "@playwright/test";

import { Given, When, Then } from "@cucumber/cucumber";
import RegisterPage from "../pages/registerPage";
// import { fixture } from "../../src/hooks/pageFixture";
import Assert from "../../src/helper/wrapper/assert";
import * as data from "../../src/helper/util/test-data/registerUser.json";
// import { getVar, setVar, debugVars } from '../../src/helper/getBundle';
// const { getVar, setVar } = globalThis.getBundle;
// import { getVar, setVar } from '@helper/bundle/vars';
// import { loc } from '@src/helper/loc';
import { vars, webFixture } from "@src/global";
import { web } from "@actions";

const { getValue, setValue } = vars;

let registerPage: RegisterPage;
let assert: Assert;
// const page = uiFixture.getCurrentPage();

Given("I navigate to the register page", async function () {
  registerPage = new RegisterPage(webFixture.getCurrentPage());
  assert = new Assert(webFixture.getCurrentPage());
  await registerPage.navigateToRegisterPage();
});

Given("I created a new user", async function () {
  const username = data.userName + Date.now().toString();
  await registerPage.registerUser(
    data.firstName,
    data.lastName,
    username,
    data.password,
    data.confirmPassword,
    "m"
  );
});

Then("I confirm user registration is success", async function () {
  await assert.assertURL("https://bookcart.azurewebsites.net/login");
});

Given(
  "I login using {param} and {string}",
  async function (username, password) {
    // await web.goto("https://ecommerce-playground.lambdatest.io/index.php?route=account/login");
    await web.goto("https://www.jotform.com/form-templates/preview/223393028066960/classic");
    // await web.type("#last_3", username);
    // await web.type("loc.json.test3.loginPage.email", username);
    // await web.fill("loc.ts.signIn.loginPage.email", username);
    await web.type("{{form::test1}} {address::test2} Street Address[1]", username);
    console.log("Config >>:", vars.getValue("config.timeout"));
    console.log("Pattern >>:", vars.getValue("pattern.athena.fields.label"));
    console.log("Pattern >>:", vars.getValue("pattern.test.fields.label"));
    console.log("Pattern - ADDON>>:", vars.getValue("pattern._sample1.fields.label"));
    console.log("Pattern - ADDON>>:", vars.getValue("pattern._sample2.fields.label"));

    await web.waitInMilliSeconds(3000);

//     // const browser = await chromium.launch({ headless: false });
//     // const context: BrowserContext = await browser.newContext();
//     // const page: Page = await context.newPage();

//     // uiFixture.setPage(page);
//     // const page = uiFixture.getCurrentPage();
//     const page = webFixture.getCurrentPage();
//     if (!page) {
//       throw new Error(
//         "❌ Page is not initialized. Did you forget to call uiFixture.setPage()?"
//       );
//     }
//     await page.goto(
//       "https://www.jotform.com/form-templates/preview/223393028066960/classic"
//     );
//     // (await loc('input', 'Last Name')).fill("Test Feed back");
//     // await uiFixture.getCurrentPage().waitForTimeout(3000);
//   }
// );

// Given("Reusable Steps: {param}", async function (steps) {
//   // Reusable Steps
});
