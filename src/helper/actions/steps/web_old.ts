import { vars, webFixture,utils,faker } from "@src/global";
import { web } from "@actions";
import { Given, When, Then } from "@cucumber/cucumber";

const { getValue, setValue } = vars;


// Browser and Page Management
// Given("I open the web browser with {param}", async function (url) {
//  web.goto(url);
// });

// When("I refresh the page", async function () {
//   const page = webFixture.getCurrentPage();
//   await page.reload();
//   console.log("🔄 Page refreshed");
// });

// When("I close the browser", async function () {
//   const page = webFixture.getCurrentPage();
//   await page.close();
//   console.log("❌ Browser closed");
// });

// // Click Actions
// When("I click on {param}", async function (locator) {
//   const page = webFixture.getCurrentPage();
//   await web.click(page, locator);
//   console.log(`🖱️ Clicked on: ${locator}`);
// });

// When("I double click on {param}", async function (locator) {
//   const page = webFixture.getCurrentPage();
//   await page.doubleClick(page, locator);
//   console.log(`🖱️🖱️ Double-clicked on: ${locator}`);
// });

// // Text Entry
// When("I type {param} into {param}", async function (text, locator) {
//   const page = webFixture.getCurrentPage();
//   await web.type(page, locator, text);
//   console.log(`⌨️ Typed "${text}" into: ${locator}`);
// });

// When("I clear the field {param}", async function (locator) {
//   const page = webFixture.getCurrentPage();
//   await web.clearField(page, locator);
//   console.log(`🗑️ Cleared field: ${locator}`);
// });

// // Form Submission
// When("I press the enter key", async function () {
//   const page: Page = this.page;
//   await page.keyboard.press("Enter");
//   console.log("↩️ Enter key pressed");
// });

// When("I submit the form {param}", async function (locator) {
//   const page: Page = this.page;
//   await page.locator(locator).press("Enter");
//   console.log(`📤 Submitted form: ${locator}`);
// });

// // Hover and Scroll
// When("I hover over {param}", async function (locator) {
//   const page: Page = this.page;
//   await web.hover(page, locator);
//   console.log(`🖱️ Hovered over: ${locator}`);
// });

// When("I scroll to {param}", async function (locator) {
//   const page: Page = this.page;
//   await page.locator(locator).scrollIntoViewIfNeeded();
//   console.log(`🖱️ Scrolled to: ${locator}`);
// });

// // Assertions
// Then("I should see {param}", async function (text) {
//   const page: Page = this.page;
//   await expect(page.locator(`text=${text}`)).toBeVisible();
//   console.log(`✅ Verified visible text: ${text}`);
// });

// Then("I should not see {param}", async function (text) {
//   const page: Page = this.page;
//   await expect(page.locator(`text=${text}`)).not.toBeVisible();
//   console.log(`🚫 Verified text not visible: ${text}`);
// });

// Then("The page URL should be {param}", async function (expectedUrl) {
//   const page: Page = this.page;
//   const currentUrl = page.url();
//   expect(currentUrl).toBe(expectedUrl);
//   console.log(`🔗 Verified page URL: ${currentUrl}`);
// });

// // File Upload
// When("I upload {param} to {param}", async function (filePath, locator) {
//   const page: Page = this.page;
//   await web.uploadFile(page, locator, filePath);
//   console.log(`📂 Uploaded file: ${filePath} to: ${locator}`);
// });

// // Checkbox and Radio Buttons
// When("I check {param}", async function (locator) {
//   const page: Page = this.page;
//   await web.check(page, locator);
//   console.log(`☑️ Checked: ${locator}`);
// });

// When("I uncheck {param}", async function (locator) {
//   const page: Page = this.page;
//   await web.uncheck(page, locator);
//   console.log(`🔲 Unchecked: ${locator}`);
// });

// When("I select {param} from dropdown {param}", async function (option, locator) {
//   const page: Page = this.page;
//   await web.selectOption(page, locator, option);
//   console.log(`📋 Selected option "${option}" from: ${locator}`);
// });

   