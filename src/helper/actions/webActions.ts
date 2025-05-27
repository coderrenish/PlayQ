import { vars, webLocResolver, webFixture, logFixture } from "@src/global";
import type { Locator } from "@playwright/test";
import { Given, When, Then } from "@cucumber/cucumber";
import { warn } from "winston";


// Given("Web: I open web browser with {param}", async function (url) {
//   await web.goto(url);
// });

Given("Web: Open Browser -url: {param} -options: {param}", openBrowser);
Given("Web: Navigate by Path -relativePath: {param} -options: {param}", navigateByPath);
Given("Web: Click Button -field: {param} -options: {param}",clickButton) 
Given("Web: Click Link -field: {param} -options: {param}",clickLink)
Given("Web: Click radio button -field: {param} -options: {param}", clickRadioButton);
Given("Web: Click checkbox -field: {param} -options: {param}", clickCheckbox);

Given("Web: Mouseover on link -field: {param} -options: {param}", mouseoverOnLink);

Given("Web: Input -field: {param} -value: {param} -options: {param}", fill) 
Given("Web: Fill -field: {param} -value: {param} -options: {param}", fill) 

Given("Web: Verify header -text: {param} -options: {param}", verifyHeaderText) 
Given("Web: Verify page title -text: {param} -options: {param}", verifyPageTitle)


/**
 * Web: Open Browser -url: {param} -options: {param}
 * 
 * Opens the web browser and navigates to the specified URL. Optionally captures a screenshot after the page loads.
 * 
 * @param url - The target URL to open. Must be a valid string. Example: "https://example.com"
 * @param options - Optional JSON string or object, supporting fields:
 *   - screenshot: (optional) [boolean] Capture a screenshot after opening the page. Default: false.
 *   - screenshot_text: (optional) [string] Text to include as metadata or attachment for the screenshot.
 *   - screenshot_fullPage: (optional) [boolean] To take Capture full page Default: true.
 * 
 * Example usage:
 *  * Web: Open Browser -url: "https://google.com" -options: "{screenshot: true, screenshot_text: "John's \"special\" Homepage"}"
 */
export async function openBrowser(url: string, options?: string | Record<string, any>) {
  const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
  const world = webFixture.getWorld();
  if (!url) await world.throwErrorAndAttach(`URL not found for parameter: ${url}`);

  const page = webFixture.getCurrentPage();
  if (!page) await world.throwErrorAndAttach(`Page is not initialized. Did you forget to call uiFixture.setPage()?`);

  const { screenshot = false, screenshot_text = "", screenshot_fullPage = true } = options_json || {};

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await processScreenshot(screenshot, screenshot_text, screenshot_fullPage);
}

/**
 * Web: Navigate by Path -relativePath: {param} -options: {param}
 * 
 * Appends a relative path to the current page's URL and navigates to it.
 * 
 * @param relativePath - The path to append (e.g., "/settings", "profile/edit")
 * @param options - Optional JSON string or object:
 *   - screenshot: [boolean] Capture a screenshot after navigation. Default: false.
 *   - screenshot_text: [string] Text description for the screenshot.
 *   - screenshot_fullPage: [boolean] Capture full page screenshot. Default: true.
 * 
 * Example:
 *  Web: Navigate by Path -relativePath: "/profile/edit" -options: "{screenshot: true, screenshot_text: 'Profile Page'}"
 */
export async function navigateByPath(relativePath: string, options: string) {
    const options_json = parseLooseJson(options);
    const { screenshot = false, screenshot_text = "", screenshot_fullPage = true } = options_json ?? {};

    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");

    const currentUrl = page.url();
    const targetUrl = new URL(relativePath, currentUrl).toString();

    console.log(`🌐 Navigating to: ${targetUrl}`);

    await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");
    await processScreenshot(screenshot, screenshot_text, screenshot_fullPage);
}



/**
 * Web: Fill -field: {param} -value: {param} -options: {param}
 * 
 * Fills a form input field (e.g., text box, textarea) with the specified value.
 * 
 * @param field - The label, placeholder, id, name, or pattern of the input field (e.g., "Username", "Email", "search").
 * @param value - The text value to fill in the input field (e.g., "JohnDoe", "test@example.com").
 * @param options - Optional JSON string or object:
 *   - pattern: [string] Optional pattern to refine element search. Default: Configured pattern.
 *   - screenshot: [boolean] Capture a screenshot after filling the input. Default: false.
 *   - screenshot_text: [string] Text description for the screenshot. Default: "".
 *   - screenshot_fullPage: [boolean] Capture a full page screenshot. Default: true.
 *   - screenshot_field: [boolean] Capture screenshot of the field (input element) only. Overrides fullPage. Default: false.
 * 
 * Example:
 *  Web: Fill -field: "Username" -value: "JohnDoe" -options: "{screenshot: true, screenshot_text: 'After filling Username', screenshot_field: true}"
 */
export async function fill(field: string | Locator, value: string, options?: string | Record<string, any>) {
  const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
  const page = webFixture.getCurrentPage();
  if (!page) throw new Error("Page not initialized");

  const { pattern, screenshot = false, screenshot_text = "", screenshot_fullPage = true, screenshot_field = false } = options_json || {};

  const target = typeof field === "string"
    ? await webLocResolver("input", field, pattern)
    : field;

  await target.fill(value);

  const isFieldScreenshot = screenshot_field === true;
  await processScreenshot(screenshot, screenshot_text, !isFieldScreenshot, isFieldScreenshot ? target : undefined);
}
// Alias for Fill
export const type = fill;
export const input = fill;
export const set = fill;
export const enter = fill;



// =================================== CLICK STEPS ===================================

/**
 * Web: Click Button -field: {param} -options: {param}
 * 
 * Clicks a button element on the page, identified by text, label, id, name, pattern, or locator.
 * 
 * @param field - The label, text, id, name, or selector of the button to click (e.g., "Submit", "Save", "Cancel").
 * @param options - Optional JSON string or object:
 *   - pattern: [string] Optional pattern to refine element search. Default: Configured pattern.
 *   - timeout: [number] Optional timeout in milliseconds for waiting. Default: Configured timeout.
 *   - screenshot: [boolean] Capture a screenshot after clicking the button. Default: false.
 *   - screenshot_text: [string] Text description for the screenshot. Default: "".
 *   - screenshot_fullPage: [boolean] Capture a full page screenshot. Default: true.
 *   - screenshot_before: [boolean] Capture a screenshot before clicking. Default: false.
 * 
 * Example:
 *  Web: Click Button -field: "Register" -options: "{screenshot: true, screenshot_text: 'After clicking Register'}"
 */
export async function clickButton(field: string | Locator, options?: string | Record<string, any>) {
    const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
    const { pattern, timeout, screenshot = false, screenshot_text = "", screenshot_fullPage = true, screenshot_before = false } = options_json || {};

    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");

    const target = typeof field === "string"
        ? await webLocResolver("button", field, pattern, timeout)
        : field;
    await processScreenshot(screenshot_before, screenshot_text, screenshot_fullPage);
    await target.click();
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");

    await processScreenshot(screenshot, screenshot_text, screenshot_fullPage);
}

/**
 * Web: Click Link -field: {param} -options: {param}
 * 
 * Clicks a link element on the page, identified by link text, label, id, name, or pattern.
 * 
 * @param field - The text, label, id, name, or selector of the link to click (e.g., "Home", "Login", "Forgot Password").
 * @param options - Optional JSON string or object:
 *   - pattern: [string] Optional pattern to refine element search. Default: Configured pattern.
 *   - timeout: [number] Optional timeout in milliseconds for waiting. Default: Configured timeout.
 *   - screenshot: [boolean] Capture a screenshot after clicking the link. Default: false.
 *   - screenshot_text: [string] Text description for the screenshot. Default: "".
 *   - screenshot_fullPage: [boolean] Capture a full page screenshot. Default: true.
 *   - screenshot_before: [boolean] Capture a screenshot before clicking. Default: false.
 * 
 * Example:
 *  Web: Click Link -field: "Register" -options: "{screenshot: true, screenshot_text: 'After clicking Register'}"
 */
export async function clickLink(field: string | Locator, options?: string | Record<string, any>) {
    const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
    const { pattern, timeout, screenshot = false, screenshot_text = "", screenshot_fullPage = true, screenshot_before = false  } = options_json || {};

    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");

    const target = typeof field === "string"
        ? await webLocResolver("link", field, pattern, timeout)
        : field;
    await processScreenshot(screenshot_before, screenshot_text, screenshot_fullPage);
    await target.click();
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");

    await processScreenshot(screenshot, screenshot_text, screenshot_fullPage);
}

/**
 * Web: Click radio button -field: {param} -options: {param}
 * 
 * Selects a radio button element on the page, identified by label, text, id, name, or pattern.
 * 
 * @param field - The label, text, id, name, or selector of the radio button to select (e.g., "Yes", "No", "Subscribe").
 * @param options - Optional JSON string or object:
 *   - pattern: [string] Optional pattern to refine element search. Default: Configured pattern.
 *   - timeout: [number] Optional timeout in milliseconds for waiting. Default: Configured timeout.
 *   - screenshot: [boolean] Capture a screenshot after selecting the radio button. Default: false.
 *   - screenshot_text: [string] Text description for the screenshot. Default: "".
 *   - screenshot_fullPage: [boolean] Capture a full page screenshot. Default: true.
 *   - screenshot_before: [boolean] Capture a screenshot before selecting the radio button. Default: false.
 * 
 * Example:
 *  Web: Click radio button -field: "{radio_group:: Newsletter} Yes" -options: "{screenshot: true, screenshot_text: 'After selecting Yes for Newsletter'}"
 */
export async function clickRadioButton(field: string | Locator, options?: string | Record<string, any>) {
    const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
    const { pattern, timeout, screenshot = false, screenshot_text = "", screenshot_fullPage = true, screenshot_before = false } = options_json || {};

    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");

    const target = typeof field === "string"
        ? await webLocResolver("radio", field, pattern, timeout)
        : field;

    await processScreenshot(screenshot_before, screenshot_text, screenshot_fullPage);
    await target.check(); // Playwright's API for selecting radio buttons
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");

    await processScreenshot(screenshot, screenshot_text, screenshot_fullPage);
}

/**
 * Web: Click checkbox -field: {param} -options: {param}
 * 
 * Selects a checkbox element on the page, identified by label, text, id, name, or pattern.
 * 
 * @param field - The label, text, id, name, or selector of the checkbox to select (e.g., "I agree", "Subscribe", "Accept Terms").
 * @param options - Optional JSON string or object:
 *   - pattern: [string] Optional pattern to refine element search. Default: Configured pattern.
 *   - timeout: [number] Optional timeout in milliseconds for waiting. Default: Configured timeout.
 *   - screenshot: [boolean] Capture a screenshot after selecting the checkbox. Default: false.
 *   - screenshot_text: [string] Text description for the screenshot. Default: "".
 *   - screenshot_fullPage: [boolean] Capture a full page screenshot. Default: true.
 *   - screenshot_before: [boolean] Capture a screenshot before selecting the checkbox. Default: false.
 * 
 * Example:
 *  Web: Click checkbox -field: "I agree" -options: "{screenshot: true, screenshot_text: 'After selecting I agree'}"
 */
export async function clickCheckbox(field: string | Locator, options?: string | Record<string, any>) {
    const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
    const { pattern, timeout, screenshot = false, screenshot_text = "", screenshot_fullPage = true, screenshot_before = false } = options_json || {};

    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");

    const target = typeof field === "string"
        ? await webLocResolver("checkbox", field, pattern, timeout)
        : field;

    await processScreenshot(screenshot_before, screenshot_text, screenshot_fullPage);
    await target.check(); // Playwright's method for checking a checkbox
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");
    await processScreenshot(screenshot, screenshot_text, screenshot_fullPage);
}

/**
 * Web: Mouseover on link -field: {param} -options: {param}
 * 
 * Performs a mouse hover over a link element on the page, identified by text, label, id, name, or pattern.
 * 
 * @param field - The text, label, id, name, or selector of the link to hover over (e.g., "Account", "Login", "Help").
 * @param options - Optional JSON string or object:
 *   - pattern: [string] Optional pattern to refine element search. Default: Configured pattern.
 *   - timeout: [number] Optional timeout in milliseconds for waiting. Default: Configured timeout.
 *   - screenshot: [boolean] Capture a screenshot after hovering over the link. Default: false.
 *   - screenshot_text: [string] Text description for the screenshot. Default: "".
 *   - screenshot_fullPage: [boolean] Capture a full page screenshot. Default: true.
 * 
 * Example:
 *  Web: Mouseover on link -field: "{{top_menu}} My Account" -options: "{screenshot: true, screenshot_text: 'Hovered on My Account'}"
 */
export async function mouseoverOnLink(field: string | Locator, options?: string | Record<string, any>) {
  const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
  const { pattern, timeout, screenshot = false, screenshot_text = "", screenshot_fullPage = true } = options_json || {};

  const page = webFixture.getCurrentPage();
  if (!page) throw new Error("Page not initialized");

  const target = typeof field === "string"
    ? await webLocResolver("link", field, pattern, timeout)
    : field;

  await target.hover();
  await page.waitForLoadState("networkidle");

  await processScreenshot(screenshot, screenshot_text, screenshot_fullPage);
}
// ==========================  VERIFY STEPS  =================================================

/**
 * Web: Verify header text -field: {param} -options: {param}
 * 
 * Verifies that a header element's text (e.g., h1, h2, h3) matches the expected text. Supports partial or exact match, case sensitivity, and optional screenshot capture. The field parameter is the expected text, while pattern refines element selection if needed.
 * 
 * @param field - The expected header text to match (e.g., "Welcome", "Dashboard").
 * @param options - Optional JSON string or object:
 *   - assert: [boolean] If false, continues the test even if the verification fails. Default: true.
 *   - pattern: [string] Override the default pattern from config for element resolution. Default: Configured pattern in config.
 *   - partial_text: [boolean] Perform a partial match instead of an exact match. Default: false.
 *   - case_sensitive: [boolean] Perform a case-sensitive match. Default: false.
 *   - locator: [string] Optional locator to refine element search. Default: "". Eg:locator: locator: "xpath=(//h3[@class='module-title'])[1]"
 *   - header_type: [string] Specify a header level (e.g., "h1", "h2", "h3"). Default: Checks all headers from h1 to h4.
 *   - timeout: [number] Optional timeout in milliseconds for waiting. Default: Configured timeout.
 *   - screenshot: [boolean] Capture a screenshot during verification. Default: false.
 *   - screenshot_text: [string] Text description for the screenshot. Default: "".
 *   - screenshot_fullPage: [boolean] Capture a full page screenshot. Default: true.
 * 
 * Example:
 *  Web: Verify header text -field: "Your Account Has Been Created!" -options: "{partial_text: true, screenshot: true, screenshot_text: 'After account creation',  locator: "xpath=(//h3[@class='module-title'])[1]" }"
 */
export async function verifyHeaderText(expectedText: string, options?: string | Record<string, any>) {
  const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
  const {
    assert = true,
    partial_text = false,
    case_sensitive = false,
    locator = "",
    header_type,
    timeout,
    screenshot = false,
    screenshot_text = "",
    screenshot_fullPage = true,
  } = options_json;

  const page = webFixture.getCurrentPage();
  if (!page) throw new Error("Page not initialized");

  let target: Locator | undefined;

  // 1️⃣ Resolve locator if provided in options
  if (locator) {
    target = await webLocResolver("header", locator, "-no-check-", timeout);
    if (!target) {
      console.warn(`⚠️ webLocResolver returned undefined for locator "${locator}". Falling back to default header search.`);
    } else {
      console.log(`📍 Locator resolved for header: ${locator}`);
    }
  }

  // 2️⃣ Fallback to default header search (h1, h2, h3, h4)
  if (!target) {
    const headerSelector = header_type || 'h1, h2, h3, h4';
    target = page.locator(headerSelector);
  }

  // 3️⃣ Verify header text match
  const count = await target.count();
  if (count === 0) {
    const world = webFixture.getWorld();
    await world.attach(`❌ No header element found for "${expectedText}"`, 'text/plain');
    if (assert !== false) {
      throw new Error(`❌ No header element found for "${expectedText}"`);
    }
    return;
  }

  let matchFound = false;
  for (let i = 0; i < count; i++) {
    let actualText = await target.nth(i).innerText();
    let compareExpected = expectedText;
    let compareActual = actualText;

    if (!case_sensitive) {
      compareExpected = compareExpected.toLowerCase();
      compareActual = compareActual.toLowerCase();
    }

    if (partial_text ? compareActual.includes(compareExpected) : compareActual === compareExpected) {
      const world = webFixture.getWorld();
      await world.attach(`✅ Header text matched at index ${i}: "${actualText}"`, 'text/plain');
      matchFound = true;
      break;
    }
  }

  const world = webFixture.getWorld();
  if (!matchFound) {
    const message = `❌ Header text not matched for "${expectedText}"`;
    await world.attach(message, 'text/plain');
    if (assert !== false) {
      throw new Error(`❌ Header text verification failed for "${expectedText}"`);
    }
  }

  // 4️⃣ Capture screenshot if needed
  await processScreenshot(screenshot, screenshot_text, screenshot_fullPage);
}

/**
 * Web: Verify page title -text: {param} -options: {param}
 * 
 * Verifies the page title matches the expected text.
 * 
 * @param expectedTitle - The expected page title to match (e.g., "Your store").
 * @param options - Optional JSON string or object, supporting fields:
 *   - assert: [boolean] If false, continues the test even if the verification fails. Default: true.
 *   - partial_check: [boolean] Perform partial match (default: false).
 *   - case_sensitive: [boolean] Case-sensitive match (default: true).
 *   - screenshot: [boolean] Capture screenshot after verification (default: false).
 *   - screenshot_text: [string] Description for screenshot attachment.
 *   - screenshot_fullPage: [boolean] Full page screenshot (default: true).
 * 
 * Example usage:
 *  * Web: Verify page title -text: "Your store" -options: "{partial_check: true, case_sensitive: false, assert: true}"
 */
export async function verifyPageTitle(expectedTitle: string, options?: string | Record<string, any>) {
  const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
  const {
    partial_check = false,
    case_sensitive = true,
    assert = true,
    screenshot = false,
    screenshot_text = "",
    screenshot_fullPage = true,
  } = options_json;

  const page = webFixture.getCurrentPage();
  if (!page) throw new Error("Page not initialized");

  let actualTitle = await page.title();
  let expected = expectedTitle;
  let actual = actualTitle;

  if (!case_sensitive) {
    expected = expected.toLowerCase();
    actual = actual.toLowerCase();
  }

  const world = webFixture.getWorld();
  if (partial_check ? actual.includes(expected) : actual === expected) {
    await world.attach(`✅ Page title matched: expected: "${expectedTitle}", found: "${actualTitle}"`, 'text/plain');
  } else {
    await world.attach(`❌ Page title mismatch: expected: "${expectedTitle}", found: "${actualTitle}"`, 'text/plain');
    this.attach(`-Soft Assertion: [Failed]-`, 'text/plain');
    world.softAssertionFailed = true;
    world.softAssertionStep = `Web: Verify page title -text: "${expectedTitle}" -options: "${options}"  -[Page title mismatch: expected: "${expectedTitle}", found: "${actualTitle}"]-` ;
    // (this as any).softAssertionFailed = true; // or use a shared flag

    if (assert !== false) {
      throw new Error(`❌ Page title verification failed`);
    }
  }

  await processScreenshot(screenshot, screenshot_text, screenshot_fullPage);
};

// Given("Web: Verify tab selected {param} options: {param}", async function (tab,options) {
//   const options_json = parseLooseJson(options);
//   await web.verifyTabSelected(tab,options_json)
// });



// // WAIT STEPS

// Given("Web: Wait in milliseconds {param}", async function (wait_time) {
//   await web.waitInMilliSeconds(parseInt(wait_time));
// });

// Given("Web: Mouseover on link {param} options: {param}", async function (link,options) {
//   const options_json = parseLooseJson(options);
//   await web.mouseoverOnLink(link,options_json)
// });

// Given("Web: Mouseover on button {param} options: {param}", async function (button,options) {
//   const options_json = parseLooseJson(options);
//   await web.mouseoverOnButton(button,options_json)
// });




// function parseLooseJson(str: string): Record<string, any> {
//   if (!str || str.trim() === "" || str.trim() === '""') {
//     return {}; // Return an empty object if the input is empty or just empty quotes
//   }

//   // Wrap in {} if not already present
//   const needsBraces = !str.trim().startsWith("{") || !str.trim().endsWith("}");
//   const wrappedStr = needsBraces ? `{${str}}` : str;

//   try {
//     const normalized = wrappedStr
//       // Quote unquoted keys: key: value → "key": value
//       .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
//       // Normalize single quotes to double quotes
//       .replace(/'/g, '"')
//       // Normalize capitalized booleans and None
//       .replace(/:\s*True\b/g, ': true')
//       .replace(/:\s*False\b/g, ': false')
//       .replace(/:\s*None\b/g, ': null')
//       // Normalize trailing commas (e.g., {a:1,})
//       .replace(/,(\s*[}\]])/g, '$1');

//     return JSON.parse(normalized);
//   } catch (err) {
//     throw new Error(`❌ Failed to parse options string: "${str}". Error: ${err.message}`);
//   }
// }

// async function processScreenshot(shouldTake: boolean, text: string = "Screenshot", fullPage: boolean = true, selector?: Locator) {
//   if (!shouldTake) return;

//   const page = webFixture.getCurrentPage();
//   if (!page) throw new Error("Page not initialized for screenshot");

//   const screenshotBuffer = selector
//     ? await selector.screenshot()
//     : await page.screenshot({ fullPage });

//   if (this && typeof this.captureAndAttachScreenshot === 'function') {
//     await this.captureAndAttachScreenshot(text, screenshotBuffer);
//   } else {
//     await logFixture.attach(text, screenshotBuffer, 'image/png');
//   }
// }


// async function processScreenshot(shouldTake: boolean, text: string = "Screenshot", fullPage: boolean = true, selector?: Locator) {
//     if (!shouldTake) return;
//     const page = webFixture.getCurrentPage();
//     if (!page) throw new Error("Page not initialized for screenshot");
//     await this.captureAndAttachScreenshot(text);
    // if (shouldTake) await this.captureAndAttachScreenshot(text);
    //  if (assert) {
    //   if (!matchFound) {
    //     await this.throwErrorAndAttach(`(Assert) Header text not found: "${text}"`);
    //   } else {
    //     await this.throwInfoAndAttach(`(Assert) Header text found: "${text}"`);
    //     if (screenshot) await this.captureAndAttachScreenshot(screenshot_text);
    //   }
    // } else {
    //   if (!matchFound) {
    //     await this.throwWarningAndAttach(`Header text not found: "${text}"`);
    //   } else {
    //     await this.throwInfoAndAttach(`Header text found: "${text}"`);
    //   }
    //   if (screenshot) await this.captureAndAttachScreenshot(screenshot_text);
    // }

//   const page = webFixture.getCurrentPage();
//   if (!page) throw new Error("Page not initialized for screenshot");

//   const screenshotBuffer = selector
//     ? await selector.screenshot()
//     : await page.screenshot({ fullPage });

//   // Attach using Playwright's native test.info().attach if available
//   try {
//     const { test } = await import('@playwright/test');
//     await test.info().attach(text, { body: screenshotBuffer, contentType: 'image/png' });
//     console.log(`✅ Screenshot attached: ${text}`);
//   } catch (e) {
//     console.warn(`⚠️ Screenshot attachment not available: ${e.message}`);
//   }

//   // Also try logFixture.attach if needed
//   try {
//     if (typeof logFixture.attach === 'function') {
//       await logFixture.attach(text, screenshotBuffer, 'image/png');
//     }
//   } catch (e) {
//     console.warn(`⚠️ logFixture.attach failed: ${e.message}`);
//   }
// }

// function parseLooseJson(str: string): Record<string, any> {
//   if (!str || str.trim() === "" || str.trim() === '""') {
//     return {}; // Return an empty object if the input is empty or just empty quotes
//   }

//   const needsBraces = !str.trim().startsWith("{") || !str.trim().endsWith("}");
//   const wrappedStr = needsBraces ? `{${str}}` : str;

//   try {
//     let normalized = wrappedStr
//     .replace(/locator:\s*(xpath|css|chain)=([^\{\}\[\],]+)/g, (match, type, value) => {
//         return `"locator": "${type}=${value.trim()}"`;
//         })
//       // Quote unquoted keys: key: value → "key": value
//       .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
//       // Handle locator cases like locator: xpath=...
//       .replace(/([,{]\s*)(["']?locator["']?\s*:\s*)([^\{\}\[\],]+)(?=[,\}])/g, (match, p1, p2, p3) => {
//         // If p3 is already quoted, skip
//         if (p3.trim().startsWith('"') || p3.trim().startsWith("'")) return match;
//         return `${p1}${p2}"${p3.trim()}"`;
//         })
//       // Normalize single quotes to double quotes
//       .replace(/'/g, '"')
//       // Normalize capitalized booleans and None
//       .replace(/:\s*True\b/g, ': true')
//       .replace(/:\s*False\b/g, ': false')
//       .replace(/:\s*None\b/g, ': null')
//       // Normalize trailing commas (e.g., {a:1,})
//       .replace(/,(\s*[}\]])/g, '$1');
//         console.log(JSON.parse(normalized))
//     return JSON.parse(normalized);
//   } catch (err) {
//     throw new Error(`❌ Failed to parse options string: "${str}". Error: ${err.message}`);
//   }
// }

// function parseLooseJson(str: string): Record<string, any> {
//   if (!str || str.trim() === "" || str.trim() === '""') {
//     return {};
//   }

//   const needsBraces = !str.trim().startsWith("{") || !str.trim().endsWith("}");
//   const wrappedStr = needsBraces ? `{${str}}` : str;
//   console.log('wrappedStr ==> ',wrappedStr);
//   try {
//     let normalized = wrappedStr
//       // Quote unquoted keys (e.g., locator: ...)
//       .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
//       // Quote locator values that start with xpath= or css= or chain=
//       .replace(/(["']?locator["']?\s*:\s*)(xpath=[^,\}\n\r]+|css=[^,\}\n\r]+|chain=[^,\}\n\r]+)/g, (match, p1, p2) => {
//         const value = p2.trim();
//         if (value.startsWith('"') || value.startsWith("'")) return match; // Already quoted
//         return `${p1}"${value}"`;
//       })
//       // Normalize single quotes to double quotes
//       .replace(/'/g, '"')
//       // Normalize booleans and None
//       .replace(/:\s*True\b/g, ': true')
//       .replace(/:\s*False\b/g, ': false')
//       .replace(/:\s*None\b/g, ': null')
//       // Remove trailing commas
//       .replace(/,(\s*[}\]])/g, '$1');

//       console.log('normalized ==> ',normalized);
//     return JSON.parse(normalized);

//   } catch (err) {
//     throw new Error(`❌ Failed to parse options string: "${str}". Error: ${err.message}`);
//   }
// }


// function parseLooseJson(str: string): Record<string, any> {
//   if (!str || str.trim() === "" || str.trim() === '""') {
//     return {};
//   }

//   const needsBraces = !str.trim().startsWith("{") || !str.trim().endsWith("}");
//   let wrappedStr = needsBraces ? `{${str}}` : str;
//   console.log('wrappedStr ==> ', wrappedStr);

//   try {
//     // Step 1: Mask only the locator values, not the key
//     const locatorRegex = /(["']?locator["']?\s*:\s*)(xpath=[^,\}\n\r]+|css=[^,\}\n\r]+|chain=[^,\}\n\r]+)/g;
//     const locatorPlaceholders: string[] = [];

//     let maskedStr = wrappedStr.replace(locatorRegex, (match, p1, p2) => {
//       locatorPlaceholders.push(`"${p2.trim()}"`);
//       return `${p1}__LOCATOR_PLACEHOLDER_${locatorPlaceholders.length - 1}__`;
//     });

//     // Step 2: Normalize keys/quotes/etc.
//     let normalized = maskedStr
//       .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
//       .replace(/'/g, '"')
//       .replace(/:\s*True\b/g, ': true')
//       .replace(/:\s*False\b/g, ': false')
//       .replace(/:\s*None\b/g, ': null')
//       .replace(/,(\s*[}\]])/g, '$1');

//     // Step 3: Restore locator values
//     locatorPlaceholders.forEach((value, index) => {
//       normalized = normalized.replace(`__LOCATOR_PLACEHOLDER_${index}__`, value);
//     });

//     console.log('normalized ==> ', normalized);
//     return JSON.parse(normalized);
//   } catch (err) {
//     throw new Error(`❌ Failed to parse options string: "${str}". Error: ${err.message}`);
//   }
// }


// function parseLooseJson(str: string): Record<string, any> {
//   if (!str || str.trim() === "" || str.trim() === '""') {
//     return {};
//   }

//   const needsBraces = !str.trim().startsWith("{") || !str.trim().endsWith("}");
//   let wrappedStr = needsBraces ? `{${str}}` : str;
//   console.log('wrappedStr ==> ', wrappedStr);

//   try {
//     // Step 1: Mask locator values (like xpath=... etc.)
//     const locatorRegex = /(["']?locator["']?\s*:\s*)(xpath=[^,\}\n\r]+|css=[^,\}\n\r]+|chain=[^,\}\n\r]+)/g;
//     const locatorPlaceholders: string[] = [];
//     let maskedStr = wrappedStr.replace(locatorRegex, (match, p1, p2) => {
//       locatorPlaceholders.push(`"${p2.trim()}"`);
//       return `${p1}__LOCATOR_PLACEHOLDER_${locatorPlaceholders.length - 1}__`;
//     });

//     // Step 2: Mask string values inside single or double quotes
//     const stringPlaceholders: string[] = [];
//     maskedStr = maskedStr.replace(/(['"])(.*?)\1/g, (match, quote, content) => {
//     const placeholder = `__STRING_PLACEHOLDER_${stringPlaceholders.length}__`;
//     stringPlaceholders.push(`"${content.replace(/"/g, '\\"')}"`); // Normalize internal quotes
//     return placeholder;
//     });

//     // Step 3: Normalize keys, booleans, etc.
//     let normalized = maskedStr
//       .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
//       .replace(/:\s*True\b/g, ': true')
//       .replace(/:\s*False\b/g, ': false')
//       .replace(/:\s*None\b/g, ': null')
//       .replace(/,(\s*[}\]])/g, '$1');

//     // Step 4: Restore string placeholders
//     stringPlaceholders.forEach((value, index) => {
//       normalized = normalized.replace(`__STRING_PLACEHOLDER_${index}__`, value);
//     });

//     // Step 5: Restore locator placeholders
//     locatorPlaceholders.forEach((value, index) => {
//       normalized = normalized.replace(`__LOCATOR_PLACEHOLDER_${index}__`, value);
//     });

//     console.log('normalized ==> ', normalized);
//     return JSON.parse(normalized);
//   } catch (err) {
//     throw new Error(`❌ Failed to parse options string: "${str}". Error: ${err.message}`);
//   }
// }


function parseLooseJson(str: string): Record<string, any> {
  if (!str || str.trim() === "" || str.trim() === '""') return {};

  const needsBraces = !str.trim().startsWith("{") || !str.trim().endsWith("}");
  let wrappedStr = needsBraces ? `{${str}}` : str;
  console.log('wrappedStr ==> ', wrappedStr);

  try {
    // Step 1: Mask locator values (preserve them)
    const locatorRegex = /(["']?locator["']?\s*:\s*)(xpath=[^,\}\n\r]+|css=[^,\}\n\r]+|chain=[^,\}\n\r]+)/g;
    const locatorPlaceholders: string[] = [];
    let maskedStr = wrappedStr.replace(locatorRegex, (match, p1, p2) => {
      locatorPlaceholders.push(`"${p2.trim()}"`);
      return `${p1}__LOCATOR_PLACEHOLDER_${locatorPlaceholders.length - 1}__`;
    });

    // Step 2: Replace only outer single quotes (if enclosing entire string)
    console.log('maskedStr (IN)==> ', maskedStr);
    maskedStr = maskedStr.replace(/:\s*'((?:[^']|\\')*)'/g, (match, p1) => {
    return `: "${p1}"`;
    });
    console.log('maskedStr (OUT)==> ', maskedStr);

    // Step 3: Normalize keys, booleans, trailing commas
    let normalized = maskedStr
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
      .replace(/:\s*True\b/g, ': true')
      .replace(/:\s*False\b/g, ': false')
      .replace(/:\s*None\b/g, ': null')
      .replace(/,(\s*[}\]])/g, '$1');

    // Step 4: Restore locator placeholders
    locatorPlaceholders.forEach((value, index) => {
      normalized = normalized.replace(`__LOCATOR_PLACEHOLDER_${index}__`, value);
    });

    console.log('normalized ==> ', normalized);
    return JSON.parse(normalized);

  } catch (err) {
    throw new Error(`❌ Failed to parse options string: "${str}". Error: ${err.message}`);
  }
}

async function processScreenshot(
  shouldTake: boolean,
  text: string = "Screenshot",
  fullPage: boolean = true,
  selector?: Locator
) {
  if (!shouldTake) return;

  const page = webFixture.getCurrentPage();
  if (!page) throw new Error("Page not initialized for screenshot");

  const screenshotBuffer = selector
    ? await selector.screenshot()
    : await page.screenshot({ fullPage });

  const world = webFixture.getWorld(); // Always get the world here

  if (world?.attach) {
    await world.attach(screenshotBuffer, 'image/png');
    await world.attach(`Screenshot Text: ${text}`, 'text/plain');
    console.log(`✅ Screenshot attached via Cucumber World: ${text}`);
  } else {
    console.warn(`⚠️ No Cucumber World context. Screenshot not attached.`);
  }
}
