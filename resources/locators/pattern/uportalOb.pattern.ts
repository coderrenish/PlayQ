// import { test as base } from '@playwright/test';

// ****************** Only CSS and XPATH locators are supported ************************
 
/* 
loc.auto.fieldName
loc.auto.forId
loc.auto.fieldInstance
loc.auto.location.value
loc.auto.section.value
*/

export const uportalOb = {
  fields: {
    label: ["//label[text()='${loc.auto.fieldName}']"
    ],
    select: [
      // "//label[text()='${loc.auto.fieldName}']//..//..//input[@value='placeholder']"
      "//label[text()='${loc.auto.fieldName}']//..//div//div[@role='button']",
      "//label[text()='${loc.auto.fieldName}']//..//div//input"
    ],
    select_options: [ 
      "//ul[@role='listbox']/li[text()='${loc.auto.fieldName}']"
       ],
    input: ["//input[@id='${loc.auto.forId}']"
    ],
    link: [
    ],
    radio: [
      "//div[@role='radiogroup']//span[text()='${loc.auto.fieldName}']"
    ],
    button: [
      "//button[text()='${loc.auto.fieldName}']",
      "//button[translate(text(), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') = '${loc.auto.fieldName}']",
    ],
    tab: [
    ],
    tab_selected: [
      "//button[@aria-selected='true'][@role='tab'][text()='${loc.auto.fieldName}']",
      "//button[@aria-selected='true'][@role='tab'][translate(text(), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') = '${loc.auto.fieldName}']"
    ],
    header: [
      "//h1[text()='${loc.auto.fieldName}']",
      "//h2[text()='${loc.auto.fieldName}']",
      "//h3[text()='${loc.auto.fieldName}']",
      "//h4[text()='${loc.auto.fieldName}']",
      "//h5[text()='${loc.auto.fieldName}']",
      "//h1[contains(text(),'${loc.auto.fieldName}')]",
      "//h2[contains(text(),'${loc.auto.fieldName}')]",
      "//h3[contains(text(),'${loc.auto.fieldName}')]",
      "//h4[contains(text(),'${loc.auto.fieldName}')]",
      "//h5[contains(text(),'${loc.auto.fieldName}')]"
    ],
    header_contains: [
      "//h1[contains(text(),'${loc.auto.fieldName}')]",
      "//h2[contains(text(),'${loc.auto.fieldName}')]",
      "//h3[contains(text(),'${loc.auto.fieldName}')]",
      "//h4[contains(text(),'${loc.auto.fieldName}')]",
      "//h5[contains(text(),'${loc.auto.fieldName}')]"
    ],
  },
  locations: {
    XXXXXX: "////xxxxxxxxxx",
    YYYYYYYY: "////yyyyyyyyyy",
  },
  sections: {
    main: "//div[@section='${loc.auto.section.value}']",
    full_name: "//li[@data-type='control_fullname']"
  },
  scroll: [
    "//div[@section='${loc.auto.section.value}']",
    "//li[@data-type='control_fullname']"
  ]
};
