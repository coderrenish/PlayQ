// import { test as base } from '@playwright/test';

// ****************** Only CSS and XPATH locators are supported ************************
 
/* 
loc.auto.fieldName
loc.auto.forId
loc.auto.fieldInstance
loc.auto.location.value
loc.auto.section.value
*/

export const _d365crm_v9_2 = {
  fields: {
    label: [
      "#username-label",
      ".password-input",
      "input[name='email2']",
      "//label[text()='${loc.auto.fieldName}']",
    ],
    select: [
      "#username-select",
      ".password-input",
      "input[name='email2']",
      "//label[text()='${loc.auto.fieldName}']",
    ],
    input: [
      "#username-input",
      ".password-input",
      "//input[@id='${loc.auto.forId}']",
      "#last_3",
      "input[id='${loc.auto.forId}']"
    ],
    link: [
      "#username-input",
      ".password-input",
      "//input[@id='{{loc.auto.forId}}']",
      "#last_3",
      "input[id='{{loc.auto.forId}}']"
    ]
  },
  locations: {
    top_menu: "//nav[@aria-label='Main Menu']",
    form: "//ul"
  },
  sections: {
    main: "//div[@section='{{loc.auto.section.value}}']",
    full_name: "//li[@data-type='control_fullname']"
  },
  scroll: [
    "//div[@section='{{loc.auto.section.value}}']",
    "//li[@data-type='control_fullname']"
  ]
};
