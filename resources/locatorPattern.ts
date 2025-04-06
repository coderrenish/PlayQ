// import { test as base } from '@playwright/test';

// ****************** Only CSS and XPATH locators are supported ************************
 
/* 
loc.auto.fieldName
loc.auto.forId
loc.auto.fieldInstance
loc.auto.location.value
loc.auto.section.value
*/

export const locPatternEntries = {
  fields: {
    label: [
      '#username-label',
      '.password-input',
      'input[name="email2"]',
      '//label[text()="{{loc.auto.fieldName}}"]',
    ],
    select: [
      '#username-select',
      '.password-input',
      'input[name="email2"]',
      `button[type="{{GlobalVar.fieldName}}"]`
    ],
    input: [
      '#username-input',
      '.password-input',
      '//input[@id="{{loc.auto.forId}}"]',
      '#last_3',
      'input[id="{{loc.auto.forId}}"]'
    ]
  },
  locations: {
    top_menu: '//nav[@aria-label="Main Menu"]',
    form: '//ul'
  },
  sections: {
    main: '//div[@section="{{loc.auto.section.value}}"]',
    full_name: '//li[@data-type="control_fullname"]'
  },
  
};

//ul >> //li[@data-type="control_fullname"] >> #last_3

// // ✅ Define TypeScript type for better type inference
// export type LocPatternEntriesType = typeof locPatternEntries;

// // 🔥 Create a Playwright fixture for `locPatternEntries`
// export const test = base.extend<{
//   locPatternEntries: LocPatternEntriesType;
// }>({
//   locPatternEntries: async ({}, use) => {
//     await use(locPatternEntries);
//   }
// });

// export { expect } from '@playwright/test';




// import { Page } from '@playwright/test';
// import GlobalVar from "./globalVariables";

// export const locPatternEntries = {
//    label: [
//     '#username',
//     '.password-input',
//     'input[name="email2"]',
//     `button[type="${GlobalVar.tempVar}"]` // ✅ Corrected - using template literals
//   ],  
//    select: [
//     '#username',
//     '.password-input',
//     'input[name="email2"]',
//     `button[type="${GlobalVar.tempVar}"]` // ✅ Corrected - using template literals
//   ],
//    input: [
//     '#username',
//     '.password-input',
//     'input[name="email2"]',
//     'button[type="submit"]'
//   ]
// };

// // ✅ Corrected export for TypeScript type inference
// export type LocPatternEntriesType = typeof locPatternEntries;




// import { Page, Locator } from '@playwright/test';
// import GlobalVar from "./globalVariables";

// class locPatternEntries {  // ✅ Renamed from LocPattern
//   static label: string[] = [
//     '#username',
//     '.password-input',
//     'input[name="email2"]',
//     `button[type="${GlobalVar.tempVar}"]` // ✅ Corrected - using template literals
//   ];
  
//   static select: string[] = [
//     '#username',
//     '.password-input',
//     'input[name="email2"]',
//     `button[type="${GlobalVar.tempVar}"]` // ✅ Corrected - using template literals
//   ];
//   static input: string[] = [
//     '#username',
//     '.password-input',
//     'input[name="email2"]',
//     'button[type="submit"]'
//   ];
// }

// export default locPatternEntries;



// // import { Page, Locator } from '@playwright/test';
// // import GlobalVar from "../_resources/globalVariables";

// export const locPatternEntries = {
//   loginPage: {
//     email: [
//       (page: Page) => page.getByLabel('E-Mail Address'),
//       (page: Page) => page.getByPlaceholder('Enter your email'),
//       (page: Page) => page.getByTestId('email-input'),
//       (page: Page) => page.locator('#email'),
//       (page: Page) => page.locator('//input[@name="email"]')
//     ],
//     password: [
//       (page: Page) => page.getByLabel(GlobalVar.tempVar),
//       (page: Page) => page.getByPlaceholder('Enter your passwordt'),
//       (page: Page) => page.getByTestId('password-inputt'),
//       (page: Page) => page.locator('#passwordt'),
//       (page: Page) => page.locator('//input[@name="passwordt"]')
//     ],
//     submit: [
//       (page: Page) => page.getByRole('button', { name: 'Login' }),
//       (page: Page) => page.getByText('Login'),
//       (page: Page) => page.getByTestId('login-button'),
//       (page: Page) => page.locator('.login-btn'),
//       (page: Page) => page.locator('//button[text()="Login"]')
//     ]
//   }
// };

// // ✅ Define TypeScript type for better auto-completion
// export type LocatorPatternType = typeof locPatternEntries;