import { test, expect, Page, BrowserContext,chromium } from '@playwright/test';

import { Given, When, Then } from "@cucumber/cucumber";
import RegisterPage from "../pages/registerPage";
// import { fixture } from "../../src/hooks/pageFixture";
import Assert from "../../src/helper/wrapper/assert";
import * as data from "../../src/helper/util/test-data/registerUser.json";
// import { getVar, setVar, debugVars } from '../../src/helper/getBundle';
// const { getVar, setVar } = globalThis.getBundle;
// import { getVar, setVar } from '@helper/bundle/vars';
// import { loc } from '@src/helper/loc';
import { vars, loc, uiFixture } from '@src/global';

const { getVar, setVar } = vars;

let registerPage: RegisterPage;
let assert: Assert;
// const page = uiFixture.getCurrentPage();

Given("I navigate to the register page", async function () {
  registerPage = new RegisterPage(uiFixture.getCurrentPage());
  assert = new Assert(uiFixture.getCurrentPage());
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

Given('I login using {param} and {string}', async function (username, password) {
  // const browser = await chromium.launch({ headless: false });
  // const context: BrowserContext = await browser.newContext();
  // const page: Page = await context.newPage();

  // uiFixture.setPage(page);
  // const page = uiFixture.getCurrentPage();
  const page = uiFixture.getCurrentPage();
if (!page) {
  throw new Error("❌ Page is not initialized. Did you forget to call uiFixture.setPage()?");
}
  await page.goto("https://www.jotform.com/form-templates/preview/223393028066960/classic");
  (await loc('input', 'Last Name')).fill("Test Feed back");
  await uiFixture.getCurrentPage().waitForTimeout(3000);
});
