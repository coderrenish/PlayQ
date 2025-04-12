import { Page, Locator } from "@playwright/test";
import { vars, webFixture, logFixture } from '@src/global';

// Global variables (adjust as needed)
let locType = "";
let locField = "";
let locFieldName = "";
let locFieldInstance = "";
let locFieldForId = "";

let locSection = "";
let locSectionName = "";
let locSectionValue = "";

let locLocation = "";
let locLocationName = "";
let locLocationValue = "";

let patternVarNameField = "";
let patternVarNameLocation = "";
let patternVarNameSection = "";
let patternVarNameSroll = "";

interface LocatorResult {
  locator: string;
  exists: boolean;
  visible: boolean;
  enabled: boolean;
}

/**
 * Helper function to query a chain locator.
 * If the locator contains ">>", it splits the string into parts and queries sequentially.
 */
function queryChain(context: ParentNode, chainLocator: string): Element | null {
  const parts = chainLocator.split(">>").map(part => part.trim());
  let currentContext: ParentNode | null = context;
  
  for (const part of parts) {
    if (!currentContext) return null;
    let element: Element | null = null;
    
    // If the part is XPath, evaluate using document.evaluate.
    if (part.startsWith("//") || part.startsWith("(")) {
      const res = document.evaluate(
        part,
        currentContext,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      element = res.singleNodeValue as Element | null;
    } else {
      // Otherwise, treat as a CSS selector.
      element = currentContext.querySelector(part);
      // If not found and current context is an Element with shadow DOM, try its shadowRoot.
      if (!element && currentContext instanceof Element && currentContext.shadowRoot) {
        element = currentContext.shadowRoot.querySelector(part);
      }
    }
    
    if (!element) return null;
    currentContext = element;
  }
  
  // Ensure the final context is an Element before returning.
  if (currentContext instanceof Element) {
    return currentContext;
  }
  return null;
}

/**
 * Helper function to query an element.
 * If the selector contains ">>", it delegates to queryChain.
 */
function queryElement(context: ParentNode, selector: string): Element | null {
  selector = selector.trim();
  if (selector.includes(">>")) {
    return queryChain(context, selector);
  }
  if (selector.startsWith("//") || selector.startsWith("(")) {
    const res = document.evaluate(
      selector,
      context,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    return res.singleNodeValue as Element | null;
  } else {
    return context.querySelector(selector);
  }
}

/**
 * Evaluates the chained locator on the page.
 * It applies locationLocator (if provided), then sectionLocator (if provided),
 * then the fieldLocator. If fieldLocator contains a chain (using ">>"),
 * queryChain is used.
 */
async function evaluateChainedLocator(
  page: Page,
  locationLocator: string | null,
  sectionLocator: string | null,
  fieldLocator: string,
  isLabelCheck: boolean
): Promise<LocatorResult> {
  // Wait for the page to load completely.
  await page.waitForLoadState("load");
  console.log(
    `⏳ Processing - locationLocator: ${locationLocator}, sectionLocator: ${sectionLocator}, fieldLocator: ${fieldLocator}, isLabelCheck: ${isLabelCheck}`
  );

  const result = await page.evaluate((args: {
    locationLocator: string | null;
    sectionLocator: string | null;
    fieldLocator: string;
    isLabelCheck: boolean;
  }): { chain: string; forAttr: string } => {
    const { locationLocator, sectionLocator, fieldLocator, isLabelCheck } = args;

    // Helper: Given a context and a chained locator string (with ">>"),
    // split it and sequentially query each part.
    function queryChain(context: ParentNode, chain: string): Element | null {
      const parts = chain.split(">>").map(p => p.trim());
      let current: ParentNode | null = context;
      for (const part of parts) {
        if (!current) return null;
        let el: Element | null = current.querySelector(part);
        // If not found, and current is an Element with shadowRoot, try that.
        if (!el && current instanceof Element && current.shadowRoot) {
          el = current.shadowRoot.querySelector(part);
        }
        if (!el) return null;
        current = el;
      }
      return current instanceof Element ? current : null;
    }

    // Main queryElement helper. If the selector includes ">>",
    // delegate to queryChain.
    function queryElement(context: ParentNode, selector: string): Element | null {
      selector = selector.trim();
      if (selector.includes(">>")) {
        return queryChain(context, selector);
      }
      // Otherwise, if it's XPath.
      if (selector.startsWith("//") || selector.startsWith("(")) {
        const res = document.evaluate(
          selector,
          context,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        return res.singleNodeValue as Element | null;
      }
      // Otherwise, assume a CSS selector.
      return context.querySelector(selector);
    }

    let currentContext: ParentNode | Document = document;

    // Apply location locator if provided.
    if (locationLocator && locationLocator.trim() !== "") {
      const locEl = queryElement(document, locationLocator);
      if (!locEl) return { chain: "", forAttr: "" };
      currentContext = locEl;
    }

    // Apply section locator if provided.
    if (sectionLocator && sectionLocator.trim() !== "") {
      const secEl = queryElement(currentContext, sectionLocator);
      if (!secEl) return { chain: "", forAttr: "" };
      currentContext = secEl;
    }

    // Now, query for the field locator.
    const fieldEl = queryElement(currentContext, fieldLocator);
    if (!fieldEl) return { chain: "", forAttr: "" };

    // Check if final element is visible.
    if (fieldEl instanceof HTMLElement) {
      const style = window.getComputedStyle(fieldEl);
      const isVisible =
        fieldEl.offsetParent !== null &&
        style.visibility !== "hidden" &&
        style.display !== "none";
      if (!isVisible) return { chain: "", forAttr: "" };
    }

    // Build the chain string by joining non-empty locators.
    const parts: string[] = [];
    if (locationLocator && locationLocator.trim() !== "") {
      parts.push(locationLocator.trim());
    }
    if (sectionLocator && sectionLocator.trim() !== "") {
      parts.push(sectionLocator.trim());
    }
    parts.push(fieldLocator.trim());
    let forAttr = "";
    if (isLabelCheck && fieldEl instanceof HTMLElement) {
      forAttr = fieldEl.getAttribute("for") || "";
    }
    return { chain: parts.join(" >> "), forAttr };
  }, { locationLocator, sectionLocator, fieldLocator, isLabelCheck });

  if (isLabelCheck) {
    locFieldForId = result.forAttr;
    console.log(`<<<<<< result.forAttr >>>>>>>>>>: ${result.forAttr}`);
  }
  console.log(`<<<<<< result.chain >>>>>>>>>>: ${result.chain}`);

  return {
    locator: result.chain,
    exists: result.chain !== "",
    visible: result.chain !== "",
    enabled: true,
  };
}

/**
 * Returns updated locator entries after replacing placeholders with global values.
 */
async function getLocatorEntries(argType: string): Promise<string[]> {
  const preprocessed = locField
    .replace(/\/\{\{/g, "$1$")
    .replace(/\/\{/g, "$2$")
    .replace(/\/\[/g, "$3$");

  const pattern = /^(?:{{([^:}]+)(?:::(.+?))?}}\s*)?(?:{([^:}]+)(?:::(.+?))?}\s*)?(.+?)(?:\[(\d+)\])?$/;
  const match = preprocessed.match(pattern);

  if (match) {
    locLocationName = match[1] ? match[1].trim() : "";
    locLocationValue = match[2] ? match[2].trim() : "";
    locSectionName = match[3] ? match[3].trim() : "";
    locSectionValue = match[4] ? match[4].trim() : "";
    locFieldName = match[5]
      ? match[5]
          .trim()
          .replace(/\$1\$/g, "{{")
          .replace(/\$2\$/g, "{")
          .replace(/\$3\$/g, "[")
      : "";
    locFieldInstance = match[6] ? match[6].trim() : "1";
  } else {
    locFieldName = locField
      .trim()
      .replace(/\$1\$/g, "{{")
      .replace(/\$2\$/g, "{")
      .replace(/\$3\$/g, "[");
    locFieldInstance = "1";
  }
  vars.setValue("loc.auto.fieldName", locFieldName);
  vars.setValue("loc.auto.fieldInstance", locFieldInstance);
  vars.setValue("loc.auto.forId", locFieldForId);
  vars.setValue("loc.auto.location.value", locLocationValue);
  vars.setValue("loc.auto.section.value", locSectionValue);
  vars.setValue("loc.auto.location.name", locLocationName);
  vars.setValue("loc.auto.section.name", locSectionName);

  locLocation = (locLocationName &&
    (vars.getValue(patternVarNameLocation + locLocationName) != patternVarNameLocation + locLocationName))
    ? vars.replaceVariables(vars.getValue(patternVarNameLocation + locLocationName))
    : "";
  locSection = (locSectionName &&
    (vars.getValue(patternVarNameSection + locSectionName) != patternVarNameSection + locSectionName))
    ? vars.replaceVariables(vars.getValue(patternVarNameSection + locSectionName))
    : "";

  console.log(">> locLocation:", locLocation);
  console.log(">> locLocationName:", locLocationName);
  console.log(">> locLocationValue:", locLocationValue);
  console.log(">> locSection:", locSection);
  console.log(">> locSectionName:", locSectionName);
  console.log(">> locSectionValue:", locSectionValue);
  console.log(">> locFieldName:", locFieldName);
  console.log(">> locFieldInstance:", locFieldInstance);

  if (vars.getValue(patternVarNameField + argType) == patternVarNameField + argType) {
    console.warn(`❌ No valid locators found for type "${argType}".`);
    return [];
  }
  return vars.replaceVariables(vars.getValue(patternVarNameField + argType)).split(",");
}

/**
 * Checks locator type.
 */
async function checkLocatorType(locator: string): Promise<"xpath" | "css"> {
  const trimmed = locator.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("(")) {
    return "xpath";
  }
  return "css";
}

/**
 * Logging function.
 */
function log(message: string) {
  // logFixture.setLogger("Pattern Logging: " + message);
  // if (loggingStatus) console.log(`Pattern Logging: ${message}`);
}

/**
 * Scroll page helper.
 */
async function scrollPage(page: Page): Promise<void> {
  const scrollList = (vars.getValue(patternVarNameSroll) != patternVarNameSroll)
    ? vars.replaceVariables(vars.getValue(patternVarNameSroll))
    : "";

  if (scrollList.trim() !== "") {
    const scrollSelectors = scrollList.split(",").map(e => e.trim());

    for (const scrollSelector of scrollSelectors) {
      const locator = page.locator(scrollSelector);
      const count = await locator.count();
      for (let i = 0; i < count; i++) {
        const item = locator.nth(i);
        if (await item.isVisible()) {
          console.log(`🔄 Scrolling to visible scroll element: ${scrollSelector} [${i}]`);
          await item.scrollIntoViewIfNeeded();
          for (let j = 0; j < 10; j++) {
            await page.mouse.wheel(0, 400);
            await page.waitForTimeout(500);
          }
        }
      }
    }
  } else {
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(500);
    }
  }
  return;
}

/**
 * Helper function that loops through locator candidates, scrolls between retries,
 * and returns a valid LocatorResult or null if none is found.
 */
async function validateLocatorLoop(
  page: Page,
  timeout: number,
  interval: number,
): Promise<LocatorResult | null> {
  const startTime = Date.now();
  const labelLocators: string[] = await getLocatorEntries("label");

  while (Date.now() - startTime < timeout) {
    if (labelLocators.length > 0 && locFieldForId == "") {
      for (const locator of labelLocators) {
        log(`>>>>> locFieldInstance: ${locFieldInstance}`);
        
        let locatorWithInstance =
          (await checkLocatorType(locator)) === "xpath" &&
          !locator.startsWith("(")
            ? `(${locator})[${locFieldInstance}]`
            : locator;
        log(`🔍 Processing label locator: ${locatorWithInstance}`);
        const result = await evaluateChainedLocator(
          page,
          locLocation,
          locSection,
          locatorWithInstance,
          true
        );
      }
    }

    const fieldLocators: string[] = await getLocatorEntries(locType);
    for (const locator of fieldLocators) {
      let locatorWithInstance =
        (await checkLocatorType(locator)) === "xpath" &&
        !locator.startsWith("(")
          ? `(${locator})[${locFieldInstance}]`
          : locator;

      log(`🔍 Processing Field locator: ${locatorWithInstance}`);

      try {
        const result = await evaluateChainedLocator(
          page,
          locLocation,
          locSection,
          locatorWithInstance,
          false
        );
        if (result && result.exists && result.visible) {
          console.log(`✅ Valid locator found: ${result.locator}`);
          return result;
        }
      } catch (error) {
        console.warn(
          `❌ Error processing locator: ${locator} – ${
            (error as Error).message
          }`
        );
      }
    }
    // Scroll to reveal lazy-loaded elements.
    await scrollPage(page);

    console.log(
      `⏳ Locator not found. Retrying in ${interval / 1000} seconds...`
    );
    await page.waitForTimeout(interval);
  }
  return null;
}

/**
 * Main function that assigns globals, updates locator entries,
 * and calls the locator validation loop.
 */
export async function locPattern(
  argType: string,
  argField: string,
  argConfig?: string
): Promise<Locator> {
  await webFixture.getCurrentPage().waitForLoadState("load");
  locField = argField.trim();
  locType = argType.trim();
  let patternFile: string;
  if (argConfig) {
    patternFile = argConfig.trim();
  } else {
    patternFile = (vars.getValue("config.patternConfig") === "config.patternConfig")
      ? ""
      : vars.getValue("config.patternConfig");
    if (patternFile === "") throw new Error(`❌ No pattern file name found. Please check your config.`);
  }

  patternVarNameField = "pattern." + patternFile.trim() + ".fields.";
  patternVarNameLocation = "pattern." + patternFile.trim() + ".locations.";
  patternVarNameSection = "pattern." + patternFile.trim() + ".sections.";
  patternVarNameSroll = "pattern." + patternFile.trim() + ".scroll";

  const timeout = 30 * 1000;
  const interval = 2000;
  const result = await validateLocatorLoop(webFixture.getCurrentPage(), timeout, interval);
  if (result && result.exists && result.visible) {
    return webFixture.getCurrentPage().locator(result.locator.toString());
  } else {
    console.warn(
      `⚠️ Timeout reached! No valid locator found for type "${argType}" with field name "${argField}".`
    );
    return webFixture.getCurrentPage().locator("");
  }
}



















// import { Page, Locator } from "@playwright/test";
// // import { locPatternEntries } from "../../resources/locatorPattern";
// // import { locPatternEntries } from "@resources/locators/locatorPattern";
// // import { vars, fixture } from '@src/global';
// import { vars, webFixture } from '@src/global';
// // import { getValue, setValue } from "../bundle/vars";


// const loggingStatus = true; // Set to true to enable logging
// // let locType: keyof typeof locPatternEntries.fields = "label";
// let locType = "";
// let locField = "";
// let locFieldName = "";
// let locFieldInstance = "";
// let locFieldForId = "";

// let locSection = "";
// let locSectionName = "";
// let locSectionValue = "";

// let locLocation = "";
// let locLocationName = "";
// let locLocationValue = "";

// let patternVarNameField = "";
// let patternVarNameLocation = "";
// let patternVarNameSection = "";
// let patternVarNameSroll = "";


// interface LocatorResult {
//   locator: string;
//   exists: boolean;
//   visible: boolean;
//   enabled: boolean;
// }

// async function evaluateChainedLocator(
//   page: Page,
//   locationLocator: string | null,
//   sectionLocator: string | null,
//   fieldLocator: string,
//   isLabelCheck: boolean
// ): Promise<LocatorResult> {
//   // Wait for the page to load completely.
//   await page.waitForLoadState("networkidle");
//   console.log(
//     `⏳ Processing - locationLocator: ${locationLocator} sectionLocator: ${sectionLocator} fieldLocator: ${fieldLocator} isLabelCheck: ${isLabelCheck}`
//   );
//   const result = await page.evaluate(
//     (args: {
//       locationLocator: string | null;
//       sectionLocator: string | null;
//       fieldLocator: string;
//       isLabelCheck: boolean;
//     }): { chain: string; forAttr: string } => {
//       const { locationLocator, sectionLocator, fieldLocator, isLabelCheck } =
//         args;

//       // Helper function: Given a context (document or an element) and a locator string,
//       // returns the first matching element.
//       function queryElement(
//         context: ParentNode,
//         selector: string
//       ): Element | null {
//         selector = selector.trim();
//         if (selector.startsWith("//") || selector.startsWith("(")) {
//           const res = document.evaluate(
//             selector,
//             context,
//             null,
//             XPathResult.FIRST_ORDERED_NODE_TYPE,
//             null
//           );
//           return res.singleNodeValue as Element | null;
//         } else {
//           return context.querySelector(selector);
//         }
//       }

//       let currentContext: Element | Document = document;

//       if (locationLocator && locationLocator.trim() !== "") {
//         const locEl = queryElement(document, locationLocator);
//         if (!locEl) return { chain: "", forAttr: "" };
//         currentContext = locEl;
//       }

//       if (sectionLocator && sectionLocator.trim() !== "") {
//         const secEl = queryElement(currentContext, sectionLocator);
//         if (!secEl) return { chain: "", forAttr: "" };
//         currentContext = secEl;
//       }

//       const fieldEl = queryElement(currentContext, fieldLocator);
//       if (!fieldEl) return { chain: "", forAttr: "" };

//       // Check if final element is visible.
//       if (fieldEl instanceof HTMLElement) {
//         const style = window.getComputedStyle(fieldEl);
//         const isVisible =
//           fieldEl.offsetParent !== null &&
//           style.visibility !== "hidden" &&
//           style.display !== "none";
//         if (!isVisible) return { chain: "", forAttr: "" };
//       }

//       // If everything is found, build the chained locator.
//       const parts: string[] = [];
//       if (locationLocator && locationLocator.trim() !== "")
//         parts.push(locationLocator.trim());
//       if (sectionLocator && sectionLocator.trim() !== "")
//         parts.push(sectionLocator.trim());
//       parts.push(fieldLocator.trim());
//       let forAttr = "";
//       if (isLabelCheck && fieldEl instanceof HTMLElement) {
//         // Extract the "for" attribute from the field element.
//         forAttr = fieldEl.getAttribute("for") || "";
//       }
//       return { chain: parts.join(" >> "), forAttr };
//     },
//     { locationLocator, sectionLocator, fieldLocator, isLabelCheck }
//   );

//   // If isLabelCheck is true, store the for attribute in a global variable.
//   if (isLabelCheck) {
//     locFieldForId = result.forAttr;
//     console.log(`<<<<<< result.forAttr >>>>>>>>>>: ${result.forAttr}`);
//   }
//   console.log(`<<<<<< result.chain >>>>>>>>>>: ${result.chain}`);

//   return {
//     locator: result.chain,
//     exists: result.chain !== "",
//     visible: result.chain !== "",
//     enabled: true,
//   };
// }

// /**
//  * Helper function that loops through locator candidates, scrolls between retries,
//  * and returns a valid LocatorResult or null if none is found.
//  */
// async function validateLocatorLoop(
//   page: Page,
//   timeout: number,
//   interval: number,
// ): Promise<LocatorResult | null> {
//   const startTime = Date.now();
//   const labelLocators: string[] = await getLocatorEntries("label");

//   while (Date.now() - startTime < timeout) {
//     if (labelLocators.length > 0 && locFieldForId == "") {
//       for (const locator of labelLocators) {
//         log(`>>>>> locFieldInstance: ${locFieldInstance}`);
        
//         let locatorWithInstance =
//           (await checkLocatorType(locator)) === "xpath" &&
//           !locator.startsWith("(")
//             ? `(${locator})[${locFieldInstance}]`
//             : locator;
//         log(`🔍 Processing label locator: ${locatorWithInstance}`);
//         const result = await evaluateChainedLocator(
//           page,
//           locLocation,
//           locSection,
//           locatorWithInstance,
//           true
//         );
//       }
//     }

//     const fieldLocators: string[] = await getLocatorEntries(locType);
//     for (const locator of fieldLocators) {
//       let locatorWithInstance =
//         (await checkLocatorType(locator)) === "xpath" &&
//         !locator.startsWith("(")
//           ? `(${locator})[${locFieldInstance}]`
//           : locator;

//       log(`🔍 Processing Field locator: ${locatorWithInstance}`);

//       try {
//         const result = await evaluateChainedLocator(
//           page,
//           locLocation,
//           locSection,
//           locatorWithInstance,
//           false
//         );
//         if (result && result.exists && result.visible) {
//           console.log(`✅ Valid locator found: ${result.locator}`);
//           return result;
//         }
//       } catch (error) {
//         console.warn(
//           `❌ Error processing locator: ${locator} – ${
//             (error as Error).message
//           }`
//         );
//       }
//     }
//     // Scroll to reveal lazy-loaded elements.
//     for (let i = 0; i < 10; i++) {
//       await page.mouse.wheel(0, 400);
//       await page.waitForTimeout(500);
//     }
//     await scrollPage(page);

//     console.log(
//       `⏳ Locator not found. Retrying in ${interval / 1000} seconds...`
//     );
//     await page.waitForTimeout(interval);
//   }
//   return null;
// }

// /**
//  * Returns updated locator entries after replacing placeholders with global values.
//  */
// async function getLocatorEntries(argType): Promise<string[]> {
//   // Regex breakdown:
//   // ^                         - start of string
//   // (?:{{([^:}]+)::([^}]+)}})? - Optionally match location block: {{LocationName::LocationValue}}
//   // (?:{([^:}]+)::([^}]+)})?    - Optionally match section block: {SectionName::SectionValue}
//   // <([^>]+)>                 - Mandatory field name enclosed in < >
//   // (?:\[(\d+)\])?            - Optional field instance enclosed in [ ]
//   // $                         - end of string
//   // const pattern = /^(?:{{([^:}]+)::([^}]+)}})?(?:{([^:}]+)::([^}]+)})?<([^>]+)>(?:\[(\d+)\])?$/;

//   const preprocessed = locField
//     .replace(/\/\{\{/g, "$1$")
//     .replace(/\/\{/g, "$2$")
//     .replace(/\/\[/g, "$3$");

//   const pattern =
//     /^(?:{{([^:}]+)(?:::(.+?))?}}\s*)?(?:{([^:}]+)(?:::(.+?))?}\s*)?(.+?)(?:\[(\d+)\])?$/;
//   const match = preprocessed.match(pattern);

//   if (match) {
//     locLocationName = match[1] ? match[1].trim() : "";
//     locLocationValue = match[2] ? match[2].trim() : "";
//     locSectionName = match[3] ? match[3].trim() : "";
//     locSectionValue = match[4] ? match[4].trim() : "";
//     locFieldName = match[5]
//       ? match[5]
//           .trim()
//           .replace(/\$1\$/g, "{{")
//           .replace(/\$2\$/g, "{")
//           .replace(/\$3\$/g, "[")
//       : "";
//     locFieldInstance = match[6] ? match[6].trim() : "1";
//   } else {
//     // Fallback: treat the entire input as the field name.
//     locFieldName = locField
//       .trim()
//       .replace(/\$1\$/g, "{{")
//       .replace(/\$2\$/g, "{")
//       .replace(/\$3\$/g, "[");
//     locFieldInstance = "1";
//   }
//   vars.setValue("loc.auto.fieldName", locFieldName);
//   vars.setValue("loc.auto.fieldInstance", locFieldInstance);
//   vars.setValue("loc.auto.forId", locFieldForId);
//   vars.setValue("loc.auto.location.value", locLocationValue);
//   vars.setValue("loc.auto.section.value", locSectionValue);
//   vars.setValue("loc.auto.location.name", locLocationName); // Not required
//   vars.setValue("loc.auto.section.name", locSectionName); // Not required

//   locLocation = (locLocationName && (vars.getValue(patternVarNameLocation+locLocationName) != patternVarNameLocation+locLocationName)) ? vars.replaceVariables(vars.getValue(patternVarNameLocation+locLocationName)) : "";
//   locSection = (locSectionName && (vars.getValue(patternVarNameSection+locSectionName) != patternVarNameSection+locSectionName)) ? vars.replaceVariables(vars.getValue(patternVarNameSection+locSectionName)) : "";
//   // let locScroll = (vars.getValue(patternVarNameSroll) != patternVarNameSroll) ? vars.replaceVariables(vars.getValue(patternVarNameSroll)) : "";

//   console.log(">> locLocation:", locLocation);
//   console.log(">> locLocationName:", locLocationName);
//   console.log(">> locLocationValue:", locLocationValue);
//   console.log(">> locSection:", locSection);
//   console.log(">> locSectionName:", locSectionName);
//   console.log(">> locSectionValue:", locSectionValue);
//   console.log(">> locFieldName:", locFieldName);
//   console.log(">> locFieldInstance:", locFieldInstance);
//   // console.log(">> locScroll:", locScroll);


//   if (vars.getValue(patternVarNameField+argType) == patternVarNameField+argType) {
//     console.warn(`❌ No valid locators found for type "${argType}".`)
//     return [];
//   }
//   return vars.replaceVariables((vars.getValue(patternVarNameField+argType))).split(",");
  
// }

// /**
//  * Checking locator type
//  */
// async function checkLocatorType(locator: string): Promise<"xpath" | "css"> {
//   // Trim the locator to remove any leading/trailing whitespace.
//   const trimmed = locator.trim();

//   // Check if the locator starts with typical XPath characters.
//   if (trimmed.startsWith("//") || trimmed.startsWith("(")) {
//     return "xpath";
//   }

//   // Otherwise, we assume it's a CSS selector.
//   return "css";
// }

// /**
//  *
//  * Console Logging for dignosis
//  */

// function log(message: string) {
//   if (!loggingStatus) console.log(`Pattern Logging: ${message}`);
// }

// async function scrollPage(page: Page): Promise<void> {
//   // const scrollList = vars.getValue(patternVarNameSroll);
//   const scrollList = (vars.getValue(patternVarNameSroll) != patternVarNameSroll) ? vars.replaceVariables(vars.getValue(patternVarNameSroll)) : "";

//   if (scrollList.trim() !== "") {
//     const scrollSelectors = scrollList.split(",").map(e => e.trim());

//     for (const scrollSelector of scrollSelectors) {
//       const locator = page.locator(scrollSelector);
//       const count = await locator.count();
//       for (let i = 0; i < count; i++) {
//         const item = locator.nth(i);
//         if (await item.isVisible()) {
//           console.log(`🔄 Scrolling to visible scroll element: ${scrollSelector} [${i}]`);
//           await item.scrollIntoViewIfNeeded();
//           for (let i = 0; i < 10; i++) {
//             await page.mouse.wheel(0, 400);
//             await page.waitForTimeout(500);
//           }
//         }
//       }
//     }
//   } else {
//     for (let i = 0; i < 10; i++) {
//       await page.mouse.wheel(0, 400);
//       await page.waitForTimeout(500);
//     }
//   }
//   return;
// }



// /**
//  * Main function that assigns globals, updates locator entries,
//  * and calls the locator validation loop.
//  */
// export async function locPattern(
// //   page: Page,
//   // type: keyof typeof locPatternEntries.fields,
//   argType: string,
//   argField: string,
//   argConfig?: string,
// ): Promise<Locator> {
//   // Wait for the page to load fully
//   await webFixture.getCurrentPage().waitForLoadState("networkidle");
//   locField = argField.trim();
//   locType = argType.trim();
//   let patternFile
//   if (argConfig) {
//     patternFile = argConfig.trim() 
//   } else {
//     patternFile = (vars.getValue("config.patternConfig") == "config.patternConfig") ? "" : vars.getValue("config.patternConfig");
//     if (patternFile == "") throw new Error(`❌ No pattern file name found. Please check your config.`);
//   }
 
//   patternVarNameField = "pattern." + patternFile.trim() + ".fields.";
//   patternVarNameLocation = "pattern." + patternFile.trim() + ".locations.";
//   patternVarNameSection = "pattern." + patternFile.trim() + ".sections.";
//   patternVarNameSroll = "pattern." + patternFile.trim() + ".scroll";

//   // const locators: string[] = getLocatorEntries(type);
//   const timeout = 30 * 1000;
//   const interval = 2000;
//   const result = await validateLocatorLoop(webFixture.getCurrentPage(), timeout, interval);
//   if (result && result.exists && result.visible) {
//     // return result.locator.toString();
//     return webFixture.getCurrentPage().locator(result.locator.toString());
//   } else {
//     console.warn(
//       `⚠️ Timeout reached! No valid locator found for type "${argType}" with field name "${argField}".`
//     );
//     // return "";
//     return webFixture.getCurrentPage().locator("");
//   }
// }
// // export async function loc(
