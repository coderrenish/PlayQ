import { vars, webLocResolver, webFixture, logFixture } from "@src/global";
import type { Locator } from "@playwright/test";
import { Given, When, Then } from "@cucumber/cucumber";
import { warn } from "winston";
import * as crypto from '../util/utilities/cryptoUtil';




// Given("Web: I open web browser with {param}", async function (url) {
//   await web.goto(url);
// });

// Given("Util: Encrypt -text: {param} -options: {param}", encrypt);
// Given("Util: Decrypt -text: {param} -options: {param}", decrypt);
Given("Util: Encrypt -text: {param} and store in -variable: {param} -options: {param}", encrypt);

Given("Util: Decrypt -text: {param} and store in -variable: {param} -options: {param}", decrypt);


export async function encrypt(encryptText: string, varName: string, options?: string | Record<string, any>) {
  const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
  let encryptedText = crypto.encrypt(encryptText);
  console.log('🔐 Encrypted Text:', encryptedText);
  vars.setValue('var.encryptedText', encryptedText);
}

export async function decrypt(encryptedText: string, varName: string, options?: string | Record<string, any>) {
  const options_json = typeof options === 'string' ? parseLooseJson(options) : (options || {});
  let decryptedText = crypto.decrypt(encryptedText);
  vars.setValue(varName, encryptedText);
}


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
