import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";

import { expect } from "@playwright/test";
// import { fixture } from "../../src/hooks/pageFixture";

// const { getVar, setVar } = globalThis.getBundle;
import { vars, webFixture } from '@src/global';
const { getVar, setVar } = vars;
const fixture = webFixture;
const page = webFixture.getCurrentPage();
const logger = webFixture.getLogger;



setDefaultTimeout(60 * 1000 * 2)

Given('User navigates to the application', async function () {
    await page.goto(process.env.BASEURL);
    // logger.in("Navigated to the application")
})

Given('User click on the login link', async function () {
    await page.locator("//span[text()='Login']").click();
});

Given('User enter the username as {string}', async function (username) {
    await page.locator("input[formcontrolname='username']").type(username);
});

Given('User enter the password as {string}', async function (password) {
    await page.locator("input[formcontrolname='password']").type(password);
})

When('User click on the login button', async function () {
    await page.locator("button[color='primary']").click();
    await page.waitForLoadState();
    // fixture.info("Waiting for 2 seconds")
    await page.waitForTimeout(2000);
});


Then('Login should be success', async function () {
    const user = page.locator("//button[contains(@class,'mat-focus-indicator mat-menu-trigger')]//span[1]");
    await expect(user).toBeVisible();
    const userName = await user.textContent();
    console.log("Username: " + userName);
    // fixture.logger.info("Username: " + userName);
})

When('Login should fail', async function () {
    const failureMesssage = page.locator("mat-error[role='alert']");
    await expect(failureMesssage).toBeVisible();
});

Given('I login using step 2 {param} and {string}', async function (username, password) {
    console.log(`✅ step 2: (PID: ${process.pid})`);

    console.log("Username: " + username);
    console.log("Password: " + password);
    console.log("From Mem: " + getVar("var.password"));
    setVar("var.password","new password 2")
    console.log("From Mem: " + getVar("var.password"));
  });
  
