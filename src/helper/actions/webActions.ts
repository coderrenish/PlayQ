import { vars, locPattern, webFixture, logFixture } from "@src/global";
// import * as locatorMap from "@resources/locators";
// import { locTs as locatorMap } from "@resources/locators";

// import { locTs } from "@resources/locators";
// import locJson from "@resources/locators.json";
import type { Locator } from '@playwright/test';
import locTs from "@resources/loc-ts";

class WebActions {
  async goto(url: string) {
    const page = webFixture.getCurrentPage();
    if (!page) {
      throw new Error("❌ Page is not initialized. Did you forget to call uiFixture.setPage()?");
    }
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }

  
  async click(selector: string | Locator) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    // await page.click(selector);
    const target = typeof selector === 'string' ? page.locator(selector) : selector;
    await target.click();
  }
  
  async type(selector: string | Locator, value: string) {
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("Page not initialized");
    // const target = typeof selector === 'string' ? page.locator(selector) : selector;
    const target = typeof selector === 'string' ? (await this.resolveLocator("input",selector)) : selector;
    await target.fill(value);
  }
  // Alias
  fill = this.type.bind(this);

  // WAITS

  async waitInMilliSeconds(ms: number) {
    const logger = logFixture.getLogger?.();
    logger?.info?.(`⏳ Waiting for ${ms} ms`);
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async waitForSelectorVisible(selector: string) {
    const page = webFixture.getCurrentPage();
    if (!page) {
      throw new Error("❌ Page is not initialized. Did you forget to call uiFixture.setPage()?");
    }
    await page.waitForSelector(selector, { state: 'visible' });
  }

  async waitForSelectorEnabled(selector: string | Locator, timeout = 5000) {
    const page = webFixture.getCurrentPage();
    if (!page) {
      throw new Error("❌ Page is not initialized. Did you forget to call uiFixture.setPage()?");
    }
    const locator = typeof selector === 'string' ? page.locator(selector) : selector;
    await locator.waitFor({ timeout, state: 'attached' });
    if (!(await locator.isEnabled())) {
      throw new Error(`❌ Element '${typeof selector === 'string' ? selector : '[Locator]'}' is not enabled after waiting`);
    }
  }

  async waitForSelectorVisibleAndEnabled(selector: string | Locator, timeout = 5000) {
    const page = webFixture.getCurrentPage();
    if (!page) {
      throw new Error("❌ Page is not initialized. Did you forget to call uiFixture.setPage()?");
    }
    const locator = typeof selector === 'string' ? page.locator(selector) : selector;
    await locator.waitFor({ state: 'visible', timeout });
    if (!(await locator.isEnabled())) {
      throw new Error(`❌ Element '${typeof selector === 'string' ? selector : '[Locator]'}' is visible but not enabled`);
    }
    const logger = logFixture.getLogger?.();
    logger?.info?.(`✅ Element '${typeof selector === 'string' ? selector : '[Locator]'}' is visible and enabled`);
  }
  
  
  
  
  
  
  
  private async resolveLocator(type: "label" | "select" | "input" | "link", selector: string): Promise<Locator> {
    console.log(`🔍 Resolving locator: ${selector}`);
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("❌ Page is not initialized.");
  
    const isXPath = selector.trim().startsWith("//") || selector.trim().startsWith("(");
    const isCSS = selector.includes(">") || selector.startsWith(".") || selector.includes("#");
    const isChained = selector.includes(">>");
    const isResourceLocator = selector.startsWith("loc.");
  
    if ((isXPath || isCSS || isChained) && !isResourceLocator) {
      console.log("📍 Detected XPath/CSS/Chained. Returning locator directly.");
      return page.locator(selector);
    }
  
    if (isResourceLocator) {
      const parts = selector.split(".");
      if (parts.length < 3) {
        throw new Error(`❌ Invalid locator format: "${selector}". Expected format: loc.(ts|json).<page>.<field>`);
      }
  
      const [,locType, pageName, fieldName] = parts;
  
      // if (typeHint === "ts") {
      //   const pageObj = (locTs as any)[pageName];
      //   if (!pageObj) throw new Error(`❌ Page "${pageName}" not found in locators.ts`);
      //   const locatorFn = pageObj[fieldName];
      //   if (!locatorFn) throw new Error(`❌ Field "${fieldName}" not found in locators.ts[${pageName}]`);
      //   console.log(`🧩 Resolved locator from locTs[${pageName}][${fieldName}]`);
      //   return locatorFn(); // direct call assuming it returns Locator
      // }
  
      if (selector.startsWith("loc.ts.")) {
        const pageObj = (locTs as any)[pageName];
        if (!pageObj) throw new Error(`❌ Page "${pageName}" not found in locators.ts`);
      
        const locatorFn = pageObj[fieldName];
        console.log(`🛠 typeof locatorFn =`, typeof locatorFn); // <-- Add this for debugging
        console.log(`🛠 locatorFn content =`, locatorFn); // <-- Add this for debugging

      
        if (!locatorFn) throw new Error(`❌ Field "${fieldName}" not found in locators.ts[${pageName}]`);
        if (typeof locatorFn !== "function") {
          throw new Error(`❌ Locator at locators.ts[${pageName}][${fieldName}] is not a function`);
        }
      
        console.log(`🧩 Resolved locator from locTs[${pageName}][${fieldName}]`);
        return locatorFn(); // ✅ Safe to call
      }

      if (selector.startsWith("loc.json.")) {
        const jsonLocatorMap = await import("@resources/loc-json.json");
        const pageObj = (jsonLocatorMap as any)[pageName];
        if (!pageObj) throw new Error(`❌ Page "${pageName}" not found in locators.json`);
        const locatorString = pageObj[fieldName];
        if (!locatorString) throw new Error(`❌ Field "${fieldName}" not found in locators.json[${pageName}]`);
        console.log(`🧩 Resolved locator string from loc.json -> ${locatorString}`);
        return page.locator(locatorString);
      }
  
      throw new Error(`❌ Unknown locator source type "${locType}". Use loc. or locator.`);
    }
  
    // Fallback to locatorPattern (locPattern)
    return await locPattern(type, selector);
  }
  
  
}

const web = new WebActions();
export default web;