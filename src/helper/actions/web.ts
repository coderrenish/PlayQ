import { vars, webLocResolver, webFixture, logFixture } from "@src/global";
import type { Locator } from "@playwright/test";
import { Given, When, Then } from "@cucumber/cucumber";
import { warn } from "winston";


Given("Web: I open web browser with {param}", async function (url) {
  await web.goto(url);
});

Given("Web: Fill input field {param} with value {param} options: {param}", async function (input,value,options) {
  const options_json = parseLooseJson(options);
  await web.type(input,value,options_json)
});

// CLICK STEPS

Given("Web: Click button {param} options: {param}", async function (button,options) {
  const options_json = parseLooseJson(options);
  await web.clickButton(button,options_json)
});

Given("Web: Click link {param} options: {param}", async function (link,options) {
  const options_json = parseLooseJson(options);
  await web.clickLink(link,options_json)
});

Given("Web: Click radio button {param} options: {param}", async function (radio,options) {
  const options_json = parseLooseJson(options);
  await web.clickRadioButton(radio,options_json)
});

Given("Web: Click checkbox {param} options: {param}", async function (checkbox,options) {
  const options_json = parseLooseJson(options);
  await web.clickCheckbox(checkbox,options_json)
});

// VERIFY STEPS
Given("Web: Verify header text is {param} options: {param}", async function (header,options) {
  const options_json = parseLooseJson(options);
  await web.verifyHeaderText(header,options_json)
});

Given("Web: Verify tab selected {param} options: {param}", async function (tab,options) {
  const options_json = parseLooseJson(options);
  await web.verifyTabSelected(tab,options_json)
});

Given("Web: Verify page title is {param} options: {param}", async function (title,options) {
  const options_json = parseLooseJson(options);
  await web.verifyPageTitle(title,options_json)
});

// WAIT STEPS

Given("Web: Wait in milliseconds {param}", async function (wait_time) {
  await web.waitInMilliSeconds(parseInt(wait_time));
});

Given("Web: Mouseover on link {param} options: {param}", async function (link,options) {
  const options_json = parseLooseJson(options);
  await web.mouseoverOnLink(link,options_json)
});

Given("Web: Mouseover on button {param} options: {param}", async function (button,options) {
  const options_json = parseLooseJson(options);
  await web.mouseoverOnButton(button,options_json)
});

class WebActions {

  async goto(url: string) {
    (!url) ? await this.throwErrorAndAttach(`URL not found for parameter: ${url}`) : ""
    
    // Open the resolved URL
    const page = webFixture.getCurrentPage();
    (!page) ? await this.throwErrorAndAttach(`Page is not initialized. Did you forget to call uiFixture.setPage()?`) : ""

    await page.goto(url, { waitUntil: "domcontentloaded" });
    console.log(`🌐 Opened URL: ${url}`);
  }


  async clickButton(selector: string | Locator, options?: { pattern?: string}) {
    const { pattern } = options || {};

    
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    // await page.click(selector);
    // const target =
    //   typeof selector === "string" ? page.locator(selector) : selector;
    const target =
      typeof selector === "string"
        ? await webLocResolver("button", selector, pattern)
        : selector;
    await target.click();
    await this.waitInMilliSeconds(500);
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");
  }

  private async clickSelect(selector: string | Locator, pattern?: string) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    // await page.click(selector);
    // const target =
    //   typeof selector === "string" ? page.locator(selector) : selector;
    const target =
      typeof selector === "string"
        ? await webLocResolver("select", selector, pattern)
        : selector;
    await target.click();
  }


  private async clickSelectOptions(selector: string | Locator, pattern?: string) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    // await page.click(selector);
    // const target =
    //   typeof selector === "string" ? page.locator(selector) : selector;
    const target =
      typeof selector === "string"
        ? await webLocResolver("selectOptions", selector, pattern)
        : selector;
    await target.click();
  }

  async clickRadioButton(selector: string | Locator, options?: {pattern?: string } ) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    const { pattern } = options;
    const target = typeof selector === "string"
      ? await webLocResolver("radio", selector, pattern)
      : selector;
    await target.click();
  }

  async clickCheckbox(selector: string | Locator, options?: {pattern?: string } ) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    const { pattern } = options;
    const target = typeof selector === "string"
      ? await webLocResolver("checkbox", selector, pattern)
      : selector;
    await target.click();
  }

  async clickLink(selector: string | Locator, options?: {pattern?: string }) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    const { pattern } = options || {};
    const target = typeof selector === "string"
      ? await webLocResolver("link", selector, pattern)
      : selector;
    await target.click();
  }

  async mouseoverOnLink(selector: string | Locator,  options?: {pattern?: string }) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    const { pattern } = options || {};
    const target = typeof selector === "string"
      ? await webLocResolver("link", selector, pattern)
      : selector;
    await target.hover();
  }

  async mouseoverOnButton(selector: string | Locator,  options?: {pattern?: string }) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    const { pattern } = options || {};
    const target = typeof selector === "string"
      ? await webLocResolver("button", selector, pattern)
      : selector;
    await target.hover();
  }

  async type(selector: string | Locator, value: string, options?: {pattern?: string }) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    const { pattern } = options || {};
    // const target = typeof selector === 'string' ? page.locator(selector) : selector;
    const target =
      typeof selector === "string"
        ? await webLocResolver("input", selector, pattern)
        : selector;
    await target.fill(value);
  }
  // Alias for Type
  fill = this.type.bind(this);
  input = this.type.bind(this);

  async select(selector: string | Locator, value: string, pattern?: string) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    // const target = typeof selector === 'string' ? page.locator(selector) : selector;
    const target =
      typeof selector === "string"
        ? await webLocResolver("select", selector, pattern)
        : selector;
    await target.selectOption(value);
  }

  async selectByClick(selector: string | Locator, value: string, pattern?: string) {
    await this.clickSelect(selector, pattern);
    await this.waitInMilliSeconds(500);
    await this.clickSelectOptions(value, pattern);
  }

  async selectByInput(selector: string | Locator, value: string, pattern?: string) {
    await this.clickSelect(selector, pattern);
    await this.waitInMilliSeconds(500);
    const page = webFixture.getCurrentPage();
    await page.keyboard.type(value);
    await this.waitInMilliSeconds(500);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
  }
  selectByFill = this.selectByInput.bind(this);


  // WAITS

  async waitInMilliSeconds(ms: number) {
    const logger = logFixture.getLogger?.();
    logger?.info?.(`⏳ Waiting for ${ms} ms`);
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async waitforHeaderText(selector: string, pattern?: string) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    await this.waitInMilliSeconds(500);
    await page.waitForLoadState("load");
    console.log("======================waitForSelectorVisible - START=============================");
    this.waitForSelectorVisible("header", selector, pattern);
    const target =
      typeof selector === "string"
        ? await webLocResolver("header", selector, pattern)
        : selector;
    await target.waitFor({ state: "visible", timeout: 30000 });
    console.log("======================waitForSelectorVisible - END=============================");

  }

  async waitforHeaderTextContains(selector: string, pattern?: string) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    await this.waitInMilliSeconds(500);
    await page.waitForLoadState("load");
    console.log("======================waitForSelectorVisible - START=============================");
    this.waitForSelectorVisible("header", selector, pattern);
    const target =
      typeof selector === "string"
        ? await webLocResolver("header_contains", selector, pattern)
        : selector;
    await target.waitFor({ state: "visible", timeout: 30000 });
    console.log("======================waitForSelectorVisible - END=============================");
  }

  private async waitForSelectorVisible(type: string, selector: string, pattern?: string) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    const target =
      typeof selector === "string"
        ? await webLocResolver(type, selector, pattern)
        : selector;
    await target.waitFor({ state: "visible", timeout: 30000 });
  }

  async waitForSelectorEnabled(selector: string | Locator, timeout = 5000) {
    const page = webFixture.getCurrentPage();
    if (!page) {
      throw new Error(
        "❌ Page is not initialized. Did you forget to call uiFixture.setPage()?"
      );
    }
    const locator =
      typeof selector === "string" ? page.locator(selector) : selector;
    await locator.waitFor({ timeout, state: "attached" });
    if (!(await locator.isEnabled())) {
      throw new Error(
        `❌ Element '${typeof selector === "string" ? selector : "[Locator]"
        }' is not enabled after waiting`
      );
    }
  }

  async waitForSelectorVisibleAndEnabled(
    selector: string | Locator,
    timeout = 5000,
    pattern?: string
  ) {
    const page = webFixture.getCurrentPage();
    if (!page) {
      throw new Error(
        "❌ Page is not initialized. Did you forget to call uiFixture.setPage()?"
      );
    }
    const locator =
      typeof selector === "string" ? page.locator(selector) : selector;
    await locator.waitFor({ state: "visible", timeout });
    if (!(await locator.isEnabled())) {
      throw new Error(
        `❌ Element '${typeof selector === "string" ? selector : "[Locator]"
        }' is visible but not enabled`
      );
    }
    const logger = logFixture.getLogger?.();
    logger?.info?.(
      `✅ Element '${typeof selector === "string" ? selector : "[Locator]"
      }' is visible and enabled`
    );
  }


  // VERIFY and ASSERT

  async verifyTextOnPage(
    text: string,
    options?: { assert?: boolean; case_sensitive?: boolean }
  ) {
    console.log(`🔍 Verifying text on page: "${text}"`);
    const page = webFixture.getCurrentPage();
    await page.waitForLoadState("load");

    const { assert = true, case_sensitive = true } = options || {};

    if (!page) throw new Error("Page not initialized");

    const locator = case_sensitive
      ? page.getByText(text, { exact: true })
      : page.getByText(text);

    if (assert) {
      const visible = await locator.isVisible();
      if (!visible) {
        await this.throwErrorAndAttach("Text not found: " + text);
      }
    } else {
      const visible = await locator.isVisible();
      visible  
        ? await this.throwInfoAndAttach(`Text is visible: "${text}"`) 
        : await this.throwWarningAndAttach(`Text not found: "${text}"`)

      return visible;
    }
  }

  async verifyHeaderText(
    text: string,
    options?: {
      assert?: boolean;
      partial_text?: boolean;
      screenshot?: boolean;
      screenshot_text?: string;
      case_sensitive?: boolean;
    }
  ) {
    const page = webFixture.getCurrentPage();
    await page.waitForLoadState("load");

    const {
      assert = true,
      partial_text = false,
      screenshot = true,
      screenshot_text = "",
      case_sensitive = true
    } = options ?? {};

    if (!page) throw new Error("Page not initialized");

    const headers = page.locator("h1, h2, h3, h4, h5");
    const count = await headers.count();

    let matchFound = false;
    for (let i = 0; i < count; i++) {
      const headerText = await headers.nth(i).innerText();
      let targetText = text;
      let currentText = headerText;
      if (!case_sensitive) {
        targetText = targetText.toLowerCase();
        currentText = currentText.toLowerCase();
      }
      if (partial_text ? currentText.includes(targetText) : currentText === targetText) {
        matchFound = true;
        break;
      }
    }

    if (assert) {
      if (!matchFound) {
        await this.throwErrorAndAttach(`(Assert) Header text not found: "${text}"`);
      } else {
        await this.throwInfoAndAttach(`(Assert) Header text found: "${text}"`);
        if (screenshot) await this.captureAndAttachScreenshot(screenshot_text);
      }
    } else {
      if (!matchFound) {
        await this.throwWarningAndAttach(`Header text not found: "${text}"`);
      } else {
        await this.throwInfoAndAttach(`Header text found: "${text}"`);
      }
      if (screenshot) await this.captureAndAttachScreenshot(screenshot_text);
    }
  }

  // async verifyHeaderText(
  //   text: string,
  //   options?: { assert?: boolean; boolean; partial_text?: boolean; screenshot?: boolean; screenshot_text?: string; case_sensitive?: boolean; pattern?: string }
  // ) {
  //   const page = webFixture.getCurrentPage();
  //   await page.waitForLoadState("load");
  //   // JSON.stringify(options) = options || {};
  //   console.log(`🔍 Verifying screenshot text: "${options}"`);
  //   const { assert = true, screenshot = true, screenshot_text = "", case_sensitive = true, pattern } = options;
  //   console.log(`🔍 Verifying screenshot text 2: "${screenshot_text}"`);

  //   if (!page) throw new Error("Page not initialized");
  //   let locator =  await webLocResolver("header", text, pattern)
  //   const actualText = await locator.innerText();

  //   if (assert) {
  //     if (actualText !== text) {
  //       await this.throwErrorAndAttach("(Assert) Header text not found: " + text);
  //     } else {
  //       await this.throwInfoAndAttach("(Assert) Header text found: " + text);
  //       if (screenshot) await this.captureAndAttachScreenshot(screenshot_text);
  //     }
  //   } else {
  //     if (actualText !== text) {
  //       await this.throwWarningAndAttach("Header text not found: " + text);
  //     } else {
  //       await this.throwInfoAndAttach("Header text found: " + text);
  //     }
  //     if (screenshot) await this.captureAndAttachScreenshot(screenshot_text);
  //   }
    
  // }

  async verifyTabSelected(
    selector: string | Locator,
    options?: { assert?: boolean; screenshot?: boolean; screenshot_text?: string; pattern?: string }
  ) {
    const page = webFixture.getCurrentPage();
    await page.waitForLoadState("load");
    if (!page) throw new Error("Page not initialized");

    const { assert = true, screenshot = true, screenshot_text = "", pattern } = options;

    const target =
      typeof selector === "string"
        ? await webLocResolver("tab_selected", selector, pattern)
        : selector;
    let visible = await target.isVisible();

    if (assert) {
      if (!visible) {
        await this.throwErrorAndAttach("(Assert) Tab not Selected/visible: " + selector);
      } else {
        await this.throwInfoAndAttach("(Assert) Tab Selected/visible: " + selector);
        if (screenshot) await this.captureAndAttachScreenshot(screenshot_text);
      }
    } else {
      if (!visible) {
        await this.throwWarningAndAttach("Tab not Selected/visible: " + selector);
      } else {
        await this.throwInfoAndAttach("Tab Selected/visible: " + selector);
      }
      if (screenshot) await this.captureAndAttachScreenshot(screenshot_text);
    }
    
  }

  async verifyPageTitle(
    text: string,
    options?: { assert?: boolean; case_sensitive?: boolean; partial_check?: boolean }
  ) {
    const page = webFixture.getCurrentPage();
    await page.waitForLoadState("load");
  
    const { assert = true, case_sensitive = true, partial_check = false } = options || {};
  
    if (!page) throw new Error("Page not initialized");
  
    const actualTitle = await page.title();
    const comparison = case_sensitive
      ? partial_check ? actualTitle.includes(text) : actualTitle === text
      : partial_check ? actualTitle.toLowerCase().includes(text.toLowerCase()) : actualTitle.toLowerCase() === text.toLowerCase();
  
    if (assert) {
      if (!comparison) {
        await this.throwErrorAndAttach(`(Assert) Page title mismatch: expected: "${text}", found: "${actualTitle}"`);
      } else {
        await this.throwInfoAndAttach(`(Assert) Page title matched: expected: "${text}", found: "${actualTitle}"`);
      }
    } else {
      if (!comparison) {
        await this.throwWarningAndAttach(`Page title mismatch: expected: "${text}", found: "${actualTitle}"`);
      } else {
        await this.throwInfoAndAttach(`Page title matched: expected: "${text}", found: "${actualTitle}"`);
      }
      return comparison;
    }
  }






  // PRIVATE FUNCTIONS
  private attachFn?: (data: any, mediaType: string) => Promise<void>;

  private async throwErrorAndAttach(message: string) {
    console.error(`${message}`);
    await this.attachFn(`- ${message}`, "text/plain");
    throw new Error(`${message}`);
  }

  private async throwWarningAndAttach(message: string) {
    console.warn(`${message}`);
    await this.attachFn(`<div style="color:orange;font-weight:bold;">⚠️ Soft-Fail: ${message}</div>`, "text/html");
    // await this.attachFn(`- ${message}`, "text/plain");
  }

  private async throwInfoAndAttach(message: string) {
    console.info(`${message}`);
    await this.attachFn(`- ${message}`, "text/plain");
  }

  setAttachFn(fn: (data: any, mediaType: string) => Promise<void>) {
    this.attachFn = fn;
  }

  private async captureAndAttachScreenshot(message: string) {
    const page = webFixture.getCurrentPage();
    if (page) {
      const screenshot = await page.screenshot();
      await this.attachFn(screenshot, "image/png");
      await this.attachFn(`Screenshot Text: ${message}`, "text/plain");
    }
  }

  private async parseOptions(optionStr: string): Promise<Record<string, any>> {
    try {
      const normalized = optionStr.replace(/'/g, '"');
      return JSON.parse(normalized);
    } catch (err) {
      console.error("❌ Failed to parse options string:", err);
      return {};
    }
  }

  

}

export function parseLooseJson(str: string): Record<string, any> {
  if (!str || str.trim() === "" || str.trim() === '""') {
    return {}; // Return an empty object if the input is empty or just empty quotes
  }

   // Wrap in {} if not already present
   const needsBraces = !str.trim().startsWith("{") || !str.trim().endsWith("}");
   const wrappedStr = needsBraces ? `{${str}}` : str;

  try {
    const normalized = wrappedStr
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // unquoted keys to quoted
      .replace(/'/g, '"'); // single to double quotes

    return JSON.parse(normalized);
  } catch (err) {
    throw new Error(`❌ Failed to parse options string: "${str}". Error: ${err.message}`);
  }
}

const web = new WebActions();
export default web;
