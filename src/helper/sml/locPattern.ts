import { Page, Locator } from "@playwright/test";
// import { locPatternEntries } from "../../resources/locatorPattern";
// import { locPatternEntries } from "@resources/locators/locatorPattern";
// import { vars, fixture } from '@src/global';
import { vars, webFixture } from '@src/global';
// import { getValue, setValue } from "../bundle/vars";


const loggingStatus = true; // Set to true to enable logging
// let locType: keyof typeof locPatternEntries.fields = "label";
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

async function evaluateChainedLocator(
  page: Page,
  locationLocator: string | null,
  sectionLocator: string | null,
  fieldLocator: string,
  isLabelCheck: boolean
): Promise<LocatorResult> {
  // Wait for the page to load completely.
  await page.waitForLoadState("networkidle");
  console.log(
    `⏳ Processing - locationLocator: ${locationLocator} sectionLocator: ${sectionLocator} fieldLocator: ${fieldLocator} isLabelCheck: ${isLabelCheck}`
  );
  const result = await page.evaluate(
    (args: {
      locationLocator: string | null;
      sectionLocator: string | null;
      fieldLocator: string;
      isLabelCheck: boolean;
    }): { chain: string; forAttr: string } => {
      const { locationLocator, sectionLocator, fieldLocator, isLabelCheck } =
        args;

      // Helper function: Given a context (document or an element) and a locator string,
      // returns the first matching element.
      function queryElement(
        context: ParentNode,
        selector: string
      ): Element | null {
        selector = selector.trim();
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

      let currentContext: Element | Document = document;

      if (locationLocator && locationLocator.trim() !== "") {
        const locEl = queryElement(document, locationLocator);
        if (!locEl) return { chain: "", forAttr: "" };
        currentContext = locEl;
      }

      if (sectionLocator && sectionLocator.trim() !== "") {
        const secEl = queryElement(currentContext, sectionLocator);
        if (!secEl) return { chain: "", forAttr: "" };
        currentContext = secEl;
      }

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

      // If everything is found, build the chained locator.
      const parts: string[] = [];
      if (locationLocator && locationLocator.trim() !== "")
        parts.push(locationLocator.trim());
      if (sectionLocator && sectionLocator.trim() !== "")
        parts.push(sectionLocator.trim());
      parts.push(fieldLocator.trim());
      let forAttr = "";
      if (isLabelCheck && fieldEl instanceof HTMLElement) {
        // Extract the "for" attribute from the field element.
        forAttr = fieldEl.getAttribute("for") || "";
      }
      return { chain: parts.join(" >> "), forAttr };
    },
    { locationLocator, sectionLocator, fieldLocator, isLabelCheck }
  );

  // If isLabelCheck is true, store the for attribute in a global variable.
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
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(500);
    }
    console.log(
      `⏳ Locator not found. Retrying in ${interval / 1000} seconds...`
    );
    await page.waitForTimeout(interval);
  }
  return null;
}

/**
 * Returns updated locator entries after replacing placeholders with global values.
 */
async function getLocatorEntries(argType): Promise<string[]> {
  // Regex breakdown:
  // ^                         - start of string
  // (?:{{([^:}]+)::([^}]+)}})? - Optionally match location block: {{LocationName::LocationValue}}
  // (?:{([^:}]+)::([^}]+)})?    - Optionally match section block: {SectionName::SectionValue}
  // <([^>]+)>                 - Mandatory field name enclosed in < >
  // (?:\[(\d+)\])?            - Optional field instance enclosed in [ ]
  // $                         - end of string
  // const pattern = /^(?:{{([^:}]+)::([^}]+)}})?(?:{([^:}]+)::([^}]+)})?<([^>]+)>(?:\[(\d+)\])?$/;

  const preprocessed = locField
    .replace(/\/\{\{/g, "$1$")
    .replace(/\/\{/g, "$2$")
    .replace(/\/\[/g, "$3$");

  const pattern =
    /^(?:{{([^:}]+)(?:::(.+?))?}}\s*)?(?:{([^:}]+)(?:::(.+?))?}\s*)?(.+?)(?:\[(\d+)\])?$/;
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
    // Fallback: treat the entire input as the field name.
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
  vars.setValue("loc.auto.location.name", locLocationName); // Not required
  vars.setValue("loc.auto.section.name", locSectionName); // Not required

  locLocation = (locLocationName && (vars.getValue(patternVarNameLocation+locLocationName) != patternVarNameLocation+locLocationName)) ? vars.replaceVariables(vars.getValue(patternVarNameLocation+locLocationName)) : "";
  locSection = (locSectionName && (vars.getValue(patternVarNameSection+locSectionName) != patternVarNameSection+locSectionName)) ? vars.replaceVariables(vars.getValue(patternVarNameSection+locSectionName)) : "";

  console.log(">> locLocation:", locLocation);
  console.log(">> locLocationName:", locLocationName);
  console.log(">> locLocationValue:", locLocationValue);
  console.log(">> locSection:", locSection);
  console.log(">> locSectionName:", locSectionName);
  console.log(">> locSectionValue:", locSectionValue);
  console.log(">> locFieldName:", locFieldName);
  console.log(">> locFieldInstance:", locFieldInstance);

  if (vars.getValue(patternVarNameField+argType) == patternVarNameField+argType) {
    console.warn(`❌ No valid locators found for type "${argType}".`)
    return [];
  }
  return vars.replaceVariables((vars.getValue(patternVarNameField+argType))).split(",");
  
}

/**
 * Checking locator type
 */
async function checkLocatorType(locator: string): Promise<"xpath" | "css"> {
  // Trim the locator to remove any leading/trailing whitespace.
  const trimmed = locator.trim();

  // Check if the locator starts with typical XPath characters.
  if (trimmed.startsWith("//") || trimmed.startsWith("(")) {
    return "xpath";
  }

  // Otherwise, we assume it's a CSS selector.
  return "css";
}

/**
 *
 * Console Logging for dignosis
 */

function log(message: string) {
  if (!loggingStatus) console.log(`Pattern Logging: ${message}`);
}




/**
 * Main function that assigns globals, updates locator entries,
 * and calls the locator validation loop.
 */
export async function locPattern(
//   page: Page,
  // type: keyof typeof locPatternEntries.fields,
  argType: string,
  argField: string,
  argConfig?: string,
): Promise<Locator> {
  // Wait for the page to load fully
  await webFixture.getCurrentPage().waitForLoadState("networkidle");
  locField = argField.trim();
  locType = argType.trim();
  let patternFile
  if (argConfig) {
    patternFile = argConfig.trim() 
  } else {
    patternFile = (vars.getValue("config.patternConfig") == "config.patternConfig") ? "" : vars.getValue("config.patternConfig");
    if (patternFile == "") throw new Error(`❌ No pattern file name found. Please check your config.`);
  }
 
  patternVarNameField = "pattern." + patternFile.trim() + ".fields.";
  patternVarNameLocation = "pattern." + patternFile.trim() + ".locations.";
  patternVarNameSection = "pattern." + patternFile.trim() + ".sections.";
  patternVarNameSroll = "pattern." + patternFile.trim() + ".scroll";

  // const locators: string[] = getLocatorEntries(type);
  const timeout = 30 * 1000;
  const interval = 2000;
  const result = await validateLocatorLoop(webFixture.getCurrentPage(), timeout, interval);
  if (result && result.exists && result.visible) {
    // return result.locator.toString();
    return webFixture.getCurrentPage().locator(result.locator.toString());
  } else {
    console.warn(
      `⚠️ Timeout reached! No valid locator found for type "${argType}" with field name "${argField}".`
    );
    // return "";
    return webFixture.getCurrentPage().locator("");
  }
}
// export async function loc(
