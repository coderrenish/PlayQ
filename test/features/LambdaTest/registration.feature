Feature: Lambda Test Playground Registration

@lambdatest_registration
Scenario: Do Registration with Lambda Test
* Web: I open web browser with "${env.lambdatest.url}"
* Web: Verify page title is "Your store" options: "partial_check: true, case_sensitive: false"
* Web: Mouseover on link "{{top_menu}} My account" options: ""
* Web: Click link "Register" options: ""
* Web: Verify header text is "Register Account" options: ""
* Web: Fill input field "First Name" with value "${faker.person.firstName()}" options: ""
* Web: Fill input field "Last Name" with value "${faker.person.lastName()}" options: ""
* Web: Fill input field "E-Mail" with value "${faker.internet.email()}" options: ""
# * Faker: Generate a telephone number to variable "var.phone" options: "style:'international'"
* Faker: Generate a mobile number to variable "var.phone" options: "countryCode: 'AU', dialCodePrefix: true"
# * Web: Fill input field "Telephone" with value "${faker.phone.number({style:'international'})}" options: ""
* Web: Fill input field "Telephone" with value "${var.phone}" options: ""
* Faker: Generate a password to variable "var.password" options: "length: 4"
* Web: Fill input field "Password" with value "${var.password}" options: ""
* Web: Fill input field "Password Confirm" with value "${var.password}" options: ""
* Web: Click radio button "{radio_group:: Newsletter} Yes" options: ""
* Web: Click checkbox "I have read and agree" options: ""
* Web: Click button "Continue" options: ""
* Web: Verify header text is "Your Account Has Been Created!" options: "partial_text: true"


# * Web: Wait in milliseconds "5000"


* Web: Fill input field "{{pop-up::user Reg}} {accordion::User Account} First Name[2]" with value "${faker.person.firstName()}" options: ""





@lambdatest_registration_with_data_file

Scenario Outline: Do Registration with Lambda Test using Data file
* Web: I open web browser with "${env.lambdatest.url}"
* Web: Verify page title is "Your store" options: "partial_check: true, case_sensitive: false"
* Web: Mouseover on link "{{top_menu}} My account" options: ""
* Web: Click link "Register" options: ""
* Web: Verify header text is "Register Account" options: ""
* Web: Fill input field "First Name" with value "<fName>" options: ""
* Web: Fill input field "Last Name" with value "<lName>" options: ""
* Web: Fill input field "E-Mail" with value "${faker.internet.email()}" options: ""
# * Faker: Generate a telephone number to variable "var.phone" options: "style:'international'"
* Faker: Generate a mobile number to variable "var.phone" options: "countryCode: 'AU', dialCodePrefix: true"
# * Web: Fill input field "Telephone" with value "${faker.phone.number({style:'international'})}" options: ""
* Web: Fill input field "Telephone" with value "${var.phone}" options: ""
* Faker: Generate a password to variable "var.password" options: "length: 4"
* Web: Fill input field "Password" with value "${var.password}" options: ""
* Web: Fill input field "Password Confirm" with value "${var.password}" options: ""
* Web: Click radio button "{radio_group:: Newsletter} Yes" options: ""
* Web: Click checkbox "I have read and agree" options: ""
* Web: Click button "Continue" options: ""
* Web: Wait in milliseconds "2000"
* Web: Verify header text is "Your Account Has Been Created!" options: "partial_text: true"
# * Web: Wait in milliseconds "30000"

Examples:{ "dataFile": "test-data/lambdaTest.csv",  "filter": "_ENV==\"DEV\" && _STATUS==\"true\" && age <= 4"}



@lambdatest_registration_with_step_group
Scenario: Do Registration with Lambda Test with Step Group
* Step Group: "@lambda_reg_navigation.steps" "Navigating to Lambda Test Registration Page"
* Web: Fill input field "First Name" with value "${faker.person.firstName()}" options: ""
* Web: Fill input field "Last Name" with value "${faker.person.lastName()}" options: ""
* Web: Fill input field "E-Mail" with value "${faker.internet.email()}" options: ""
# * Faker: Generate a telephone number to variable "var.phone" options: "style:'international'"
* Faker: Generate a mobile number to variable "var.phone" options: "countryCode: 'AU', dialCodePrefix: true"
# * Web: Fill input field "Telephone" with value "${faker.phone.number({style:'international'})}" options: ""
* Web: Fill input field "Telephone" with value "${var.phone}" options: ""
* Faker: Generate a password to variable "var.password" options: "length: 4"
* Web: Fill input field "Password" with value "${var.password}" options: ""
* Web: Fill input field "Password Confirm" with value "${var.password}" options: ""
* Web: Click radio button "{radio_group:: Newsletter} Yes" options: ""
* Web: Click checkbox "I have read and agree" options: ""
* Web: Click button "Continue" options: ""
* Web: Wait in milliseconds "2000"
* Web: Verify header text is "Your Account Has Been Created!" options: "partial_text: true"

@lambdatest_registration_with_direct_locators
Scenario: Do Registration with Lambda Test with Direct Locators
* Step Group: "@lambda_reg_navigation.steps" "Navigating to Lambda Test Registration Page"
* Web: Fill input field "css=input[name='firstname']" with value "${faker.person.firstName()}" options: ""
* Web: Fill input field "xpath=\//input[@placeholder='Last Name']" with value "${faker.person.lastName()}" options: ""
* Web: Fill input field "chain=fieldset#account >> input[name='email']" with value "${faker.internet.email()}" options: ""
* Faker: Generate a mobile number to variable "var.phone" options: "countryCode: 'AU', dialCodePrefix: true"
* Web: Fill input field "loc.json.lambdatest.registerPage.inpt_telephone" with value "${var.phone}" options: ""
* Faker: Generate a password to variable "var.password" options: "length: 4"
* Web: Fill input field "loc.ts.lambdatest.registerPage.inpt_password" with value "${var.password}" options: ""
* Web: Fill input field "loc.ts.lambdatest.registerPage.inpt_password_confirm" with value "${var.password}" options: ""
* Web: Click radio button "{radio_group:: Newsletter} Yes" options: ""
* Web: Click checkbox "I have read and agree" options: ""
* Web: Wait in milliseconds "5000"
* Web: Click button "Continue" options: ""
* Web: Verify header text is "Your Account Has Been Created!" options: "partial_text: true"