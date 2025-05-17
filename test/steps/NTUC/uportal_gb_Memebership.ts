import { Given, When, Then } from "@cucumber/cucumber";
// import { fixture } from "../../src/hooks/pageFixture";

// import { getVar, setVar, debugVars } from '../../src/helper/getBundle';
// const { getVar, setVar } = globalThis.getBundle;
// import { getVar, setVar } from '@helper/bundle/vars';
// import { loc } from '@src/helper/loc';
import { vars, webFixture,utils,faker } from "@src/global";
import { web } from "@actions";
import { cli } from "winston/lib/winston/config";
import { fa } from "@faker-js/faker";

Given(
  "UPORTAL-GB: Open browser and navigate to membership page {param}",
  async function (url) {
    faker.person.firstName()
    console.log("=====SG===>" + faker.custom.postcode.get("SG"));
    console.log("=====AU===>" + faker.custom.postcode.get("AU"));
    console.log("=====AU, QLD===>" + faker.custom.postcode.get("AU", "QLD"));
    faker.custom.passport({countryCode:"AU"});
    await web.goto(url);
    // await web.waitInMilliSeconds(5000);
    await web.verifyTextOnPage("NTUC Membership benefitt",{ assert: false });

    await web.clickButton("Start Application");
    await web.clickButton("Apply manually");
    await web.waitforHeaderText("NTUC Union Membership");


    // await web.click("START APPLICATION");
    // await web.click("APPLY MANUALLY");
    let nric = utils.generateNRIC("S", 1968, false);
    // let name = faker.person.fullName().replace(/-/g, ' ');
    let name = faker.custom.person.fullName(26,["-"]);
    let mobile = faker.custom.mobile.number({countryCode:"SG",dialCodePrefix:false});
    let email = faker.internet.email();
    let postcode = faker.custom.postcode.get("SG")
    console.log('🌐🌐🌐🌐🌐🌐🌐🌐🌐 - PostCode', postcode);

    const dob = faker.date.between({ from: new Date("1968-01-01"), to: new Date("1968-12-31") });
    const formattedDob = dob.toLocaleDateString("en-GB"); // Converts to dd/mm/yyyy
    
    await web.fill("NRIC / FIN number", nric);
    await web.fill("Name as per NRIC / Passport", name);
    await web.fill("Name to print on card (26 characters max)", name);
    await web.fill("Date of birth", formattedDob);
    await web.clickRadioButton("Female")
    await web.fill("Mobile number", mobile);
    await web.fill("Email address", email);
    await web.selectByClick("Residential status", "SINGAPORE CITIZEN");
    await web.selectByClick("Race", "INDIAN");
    await web.selectByClick("Marital status", "SINGLE");
    await web.selectByClick("Education level", "DEGREE");
    await web.clickButton("Save and continue");


    await web.fill("Postal Code", postcode);
    await web.clickButton("Get Address");
    // await web.waitInMilliSeconds(1000);
    await web.fill("Floor no.","-");
    await web.fill("Unit no.","-");


    // await web.fill("Company name (In full)", faker.company.name());
    await web.selectByInput("Occupational group","FREELANCER/SEP - OTHERS");
    await web.fill("Job title", "Consultant");

    // await web.selectByClickAndFill("Company name (In full)","CMPU TEST COMPANY");

    await web.selectByInput("Monthly gross salary","$2,500 - $2,999");
    await web.clickButton("Save and continue");

    await web.selectByInput("Bank name","ABN AMRO BANK NV");
    await web.fill("Bank acc no. (Do not enter credit card details)", "12345678");
    await web.clickButton("Save and continue");
    await web.clickButton("Save and continue");
    // await web.waitInMilliSeconds(2000);
    console.log("Waiting for Review header...");
    await web.waitforHeaderTextContains("Review");
    // await web.waitforHeaderText("Review application");

    console.log("Waiting for Review header...CLOSING");

    

    



    





    
    console.log('🌐🌐🌐🌐🌐🌐🌐🌐🌐 - PostCode', postcode);
    // await web.waitInMilliSeconds(30000);

//     const tags = process.env.TAGS;
//     console.log('🔥 Running with tags:', tags);
//     console.log('🌐 Base URL:', process.env.BASEURL);
// console.log('🧭 Browser:', vars.getValue("env.BROWSER"));
// console.log('👀 Headless Mode:', process.env.HEAD === 'true');


//     // await web.goto("https://ecommerce-playground.lambdatest.io/index.php?route=account/login");
//     vars.setValue("var.username", faker.person.firstName());
//     await web.goto("https://www.jotform.com/form-templates/preview/223393028066960/classic");
//     await web.type("Street Address", password,"_d365crm_v9_2");
//     await d365crm.d365LoginTestStep("TESTING - USERNAME", "TESTING - PASSWORD");
//     await d365crm.d365Input("TESTING - INPUT");
//     // await web.goto("https://practice.expandtesting.com/infinite-scroll"); // Scroll test
//     // await web.goto("https://practice.expandtesting.com/shadowdom"); // Shadow Dom Test
//     // await web.click("This button is inside a Shadow DOM.");
//     // await web.type("#last_3", username);
//     // await web.type("loc.json.test3.loginPage.email", username);
//     // await web.fill("loc.ts.signIn.loginPage.email", username);
    
//     console.log("Config (via vars) >>:", vars.getValue("config.timeout"));
//     console.log("Config >>:", vars.getConfigValue("timeout"));

//     console.log("Pattern >>:", vars.getValue("pattern.athena.fields.label"));
//     console.log("Pattern >>:", vars.getValue("pattern.test.fields.label"));
//     console.log("Pattern - ADDON>>:", vars.getValue("pattern._sample1.fields.label"));
//     console.log("Pattern - ADDON>>:", vars.getValue("pattern._sample2.fields.label"));

//     console.log("UTILS >>:", utils.toCamelCase("11To thw -Camel # Case_ 123"));
//     let nric = utils.generateNRIC("S",1968,false)
//     console.log("UTILS - NRIC >>:", nric);
//     console.log("UTILS - NRIC to year>>:", utils.getYearFromNRIC("S6073485B"));

//     console.log("FAKER - Generate Name>>:", faker.person.firstName("female"));
//     console.log("FAKER - Generate Name>>:", faker.person.lastName());
//     console.log("FAKER - Generate Passport>>:", faker.passport.number("SG"));
    

//     // const browser = await chromium.launch({ headless: false });
//     // const context: BrowserContext = await browser.newContext();
//     // const page: Page = await context.newPage();

//     // uiFixture.setPage(page);
//     // const page = uiFixture.getCurrentPage();
//     const page = webFixture.getCurrentPage();
//     if (!page) {
//       throw new Error(
//         "❌ Page is not initialized. Did you forget to call uiFixture.setPage()?"
//       );
//     }
//     await page.goto(
//       "https://www.jotform.com/form-templates/preview/223393028066960/classic"
//     );
//     // (await loc('input', 'Last Name')).fill("Test Feed back");
//     // await uiFixture.getCurrentPage().waitForTimeout(3000);
//   }
// );

// Given("Reusable Steps: {param}", async function (steps) {
//   // Reusable Steps
});
