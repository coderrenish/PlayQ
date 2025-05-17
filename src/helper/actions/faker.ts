import { vars, faker, webLocResolver, webFixture, logFixture } from "@src/global";
import { Given, When, Then } from "@cucumber/cucumber";


Given("Faker: Generate an email to variable {param}", async function (varName) {
  vars.setValue(varName, faker.internet.email());
});

Given("Faker: Generate a password to variable {param} options: {param}", async function (varName, options) {
  const options_json = parseLooseJson(options);
  const {length = 12, memorable = false, pattern, prefix = "" } = options_json;
  const resolvedPattern = pattern ? new RegExp(pattern) : undefined;
  const password = faker.internet.password({length, memorable, pattern: resolvedPattern, prefix });
  vars.setValue(varName, password);
});

Given("Faker: Generate a telephone number to variable {param} options: {param}", async function (varName, options) {
  const options_json = parseLooseJson(options);
  const {style =  chooseRandom("human", "national", "international")} = options_json;
  const phoneNumber = faker.phone.number({style: style});
  vars.setValue(varName, phoneNumber);
});

Given("Faker: Generate a mobile number to variable {param} options: {param}", async function (varName, options) {
  const options_json = parseLooseJson(options);
  const {countryCode = chooseRandom("SG", "AU", "US"), dialCodePrefix = false} = options_json;
  // const {style =  chooseRandom("human", "national", "international")} = options_json;
  const phoneNumber = faker.custom.mobile.number({countryCode: countryCode, dialCodePrefix: dialCodePrefix});
  vars.setValue(varName, phoneNumber);
});



function chooseRandom<T>(...values: T[]): T {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
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