// src/helper/loc/locatorResolver.ts
import { Page, Locator } from "@playwright/test";
import { vars, webFixture, logFixture, webLocPattern} from "@src/global";

export async function webLocResolver(
    type: string,
    selector: string,
    pattern?: string
  ): Promise<Locator> {
    console.log(`🔍 Resolving locator: ${selector}`);
    const page = webFixture.getCurrentPage();
    if (!page) throw new Error("❌ Page is not initialized.");

    const isPlaywrightPrefixed = selector.startsWith("xpath=") || selector.startsWith("xpath =") || selector.startsWith("css=") || selector.startsWith("css =");
    if (isPlaywrightPrefixed) {
      const rawSelector = selector.replace(/^xpath=|^css=|^xpath =|^css =/, "");
      console.log("📍 Detected Playwright-prefixed selector. Returning raw locator.");
      return page.locator(rawSelector);
    }

    const isPlaywrightChainedPrefixed = selector.startsWith("chain=") || selector.startsWith("chain =");
    if (isPlaywrightChainedPrefixed) {
      const rawSelector = selector.replace(/^chain=|^chain =/, "");
      console.log("📍 Detected Playwright-prefixed chained selector. Returning raw locator.");
      return page.locator(rawSelector);
    }

    const isXPath =
      selector.trim().startsWith("//") || selector.trim().startsWith("(");
    const isCSS =
      selector.includes(">") ||
      selector.startsWith(".") ||
      selector.includes("#");
    const isChained = selector.includes(">>");
    const isResourceLocator = selector.startsWith("loc.");

    if ((isXPath || isCSS || isChained) && !isResourceLocator) {
      console.log("📍 Detected XPath/CSS/Chained. Returning locator directly.");
      return page.locator(selector);
    }

    if (isResourceLocator) {
      const parts = selector.split(".");
      if (parts.length < 3) {
        throw new Error(
          `❌ Invalid locator format: "${selector}". Expected format: loc.(ts|json).<page>.<field>`
        );
      }

      const [, locType, pageName, fieldName] = parts;

    
      if (selector.startsWith("loc.ts.")) {
        const [, , fileName, pageName, fieldName] = selector.split(".");
        const tsLocatorModule = await import(
          `@resources/locators/loc-ts/${fileName}.ts`
        );
        const pageObj = tsLocatorModule?.[fileName]?.[pageName];
        if (!pageObj)
          throw new Error(`❌ Page "${pageName}" not found in ${fileName}.ts`);
        const locatorFn = pageObj[fieldName];
        if (!locatorFn)
          throw new Error(
            `❌ Field "${fieldName}" not found in ${fileName}.ts[${pageName}]`
          );
        if (typeof locatorFn !== "function") {
          throw new Error(
            `❌ Locator at ${fileName}.ts[${pageName}][${fieldName}] is not a function`
          );
        }
        console.log(
          `🧩 Resolved locator from loc.ts.${fileName}.${pageName}.${fieldName}`
        );
        return locatorFn();
      }


      if (selector.startsWith("loc.json.")) {
        const [, , fileName, pageName, fieldName] = selector.split(".");
        const jsonLocatorMap = await import(
          `@resources/locators/loc-json/${fileName}.json`
        );
        const pageObj = jsonLocatorMap?.[pageName];
        if (!pageObj)
          throw new Error(
            `❌ Page "${pageName}" not found in ${fileName}.json`
          );
        const locatorString = pageObj[fieldName];
        if (!locatorString)
          throw new Error(
            `❌ Field "${fieldName}" not found in ${fileName}.json[${pageName}]`
          );
        console.log(
          `🧩 Resolved locator string from loc.json.${fileName}.${pageName}.${fieldName} -> ${locatorString}`
        );
        return page.locator(await vars.replaceVariables(locatorString));
      }

      throw new Error(
        `❌ Unknown locator source type "${locType}". Use loc. or locator.`
      );
    }

    // Fallback to locatorPattern (locPattern)
    return await webLocPattern(type, selector, pattern);
    // return await locPattern(type, selector);
  }

// export async function webLocResolver(type: string, selector: string, pattern?: string): Promise<Locator> {
//     console.log(`🔍 Resolving locator: ${selector}`);
//     const page = webFixture.getCurrentPage();
//     const isXPath = selector.trim().startsWith("//") || selector.trim().startsWith("(");
//     const isCSS = selector.includes(">") || selector.startsWith(".") || selector.includes("#");
//     const isChained = selector.includes(">>");
//     const isResourceLocator = selector.startsWith("loc.");

//     if ((isXPath || isCSS || isChained) && !isResourceLocator) {
//         console.log("📍 Detected XPath/CSS/Chained. Returning locator directly.");
//         return page.locator(selector);
//     }

//     if (isResourceLocator) {
//         return resolveResourceLocator(page, selector);
//     }

//     return await webLocPattern(type, selector, pattern);
// }

// async function resolveResourceLocator(page: Page, selector: string): Promise<Locator> {
//     const parts = selector.split(".");
//     if (parts.length < 3) {
//         throw new Error(`❌ Invalid locator format: "${selector}". Expected format: loc.(ts|json).<page>.<field>`);
//     }

//     const [, locType, pageName, fieldName] = parts;
//     if (locType === "ts") {
//         const module = await import(`@resources/locators/loc-ts/${pageName}.ts`);
//         const locatorFn = module[pageName]?.[fieldName];
//         if (!locatorFn) throw new Error(`❌ Field "${fieldName}" not found in ${pageName}.ts`);
//         return locatorFn();
//     }

//     if (locType === "json") {
//         const module = await import(`@resources/locators/loc-json/${pageName}.json`);
//         const locatorString = module[pageName]?.[fieldName];
//         if (!locatorString) throw new Error(`❌ Field "${fieldName}" not found in ${pageName}.json`);
//         return page.locator(locatorString);
//     }

//     throw new Error(`❌ Unknown locator source type "${locType}".`);
// }