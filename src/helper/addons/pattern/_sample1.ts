// import { test as base } from '@playwright/test';

// ****************** Only CSS and XPATH locators are supported ************************
 
/* 
loc.auto.fieldName
loc.auto.forId
loc.auto.fieldInstance
loc.auto.location.value
loc.auto.section.value
*/

export const _sample1 = {
  fields: {
    label: [
      "//label[text()='${loc.auto.fieldName}']",
    ],
    select: [
      '#username-select',
      '.password-input',
      'input[name="email2"]',
      `button[type="{{GlobalVar.fieldName}}"]`
    ],
    input: [
    
      "input[id='${loc.auto.forId}']",
    ],
    link: [
      '#username-input',
      '.password-input',
      '//input[@id="{{loc.auto.forId}}"]',
      '#last_3',
      'input[id="{{loc.auto.forId}}"]'
    ],
    button: [
      "#shadow-host >> #my-btn"
    ]
  },
  locations: {
    top_menu: '//nav[@aria-label="Main Menu"]',
    form: '//ul'
  },
  sections: {
    address: "//li[@id='id_4']",
    full_name: "//li[@data-type='control_fullname']",
  },
  scroll: [
    "//h1"
  ]
};
