import { Page } from '@playwright/test';
import { webFixture } from "@src/global";


export const locTs = {

  test: {
    // email: (page: Page) => page.locator('//input[@name="email"]'),
    // email: () => page().locator('//input[@name="email"]'),
    // lName: (page: Page) => page.locator('#last_3'),
    email: () => page().getByLabel('E-Mail Address'),
    submit: () => page().getByRole('button', { name: 'Login' })
  },
  loginPage: {
    // email: (page: Page) => page.getByLabel('E-Mail Address'),
    email: () => page().locator('#input-email'),
    password: () => page().getByLabel('Password'),
    submit: () => page().getByRole('button', { name: 'Login' })
  }
};

export default locTs;

function page(): Page {
  const pg = webFixture.getCurrentPage();
  if (!pg) throw new Error("❌ Page is not initialized in locators.ts");
  return pg;
}



/*
▗▖    ▗▄▖  ▗▄▄▖ ▗▄▖ ▗▄▄▄▖ ▗▄▖ ▗▄▄▖  ▗▄▄▖
▐▌   ▐▌ ▐▌▐▌   ▐▌ ▐▌  █  ▐▌ ▐▌▐▌ ▐▌▐▌   
▐▌   ▐▌ ▐▌▐▌   ▐▛▀▜▌  █  ▐▌ ▐▌▐▛▀▚▖ ▝▀▚▖
▐▙▄▄▖▝▚▄▞▘▝▚▄▄▖▐▌ ▐▌  █  ▝▚▄▞▘▐▌ ▐▌▗▄▄▞▘

Which Locator Should You Use?
Scenario	            Recommended Locator	                        Alternative
Buttons & Links	        getByRole('button', { name: 'Submit' })     getByText('Submit')
Text Inputs	            getByLabel('Email')	                        getByPlaceholder('Enter email')
Dropdowns	            selectOption()	                            locator('select')
Check & Radio Buttons	getByRole('checkbox')	                    check()
Tables & Lists	        locator().nth(1)	                        filter({ hasText: 'Value' })
Custom Test IDs	        getByTestId('login-btn')	                locator('[data-testid="login-btn"]')

Best Practices for Locators
	1.	Use getByRole(), getByLabel(), or getByTestId() whenever possible.
	2.	Avoid XPath unless absolutely necessary.
	3.	Use locator().filter() for filtering elements dynamically.
	4.	Use nth(), first(), and last() when working with lists and tables.
	5.	Use getByTestId() when working with dynamic front-end frameworks.


1. Recommended Locators (Stable & Readable)
These are Playwright’s best and most stable locators.

Locator	            Example	                                        Use Case
getByLabel()	    page.getByLabel('Email Address')	            Use for input fields linked to <label> elements.
getByPlaceholder()	page.getByPlaceholder('Enter your email')	    Use for text inputs that have a placeholder attribute.
getByRole()	        page.getByRole('button', { name: 'Login' })	    Best for buttons, links, and interactive elements.
getByTestId()	    page.getByTestId('login-button')	            Use when elements have data-testid attributes (most stable).
getByText()	        page.getByText('Sign In')	                    Use for selecting elements based on visible text content.
getByTitle()	    page.getByTitle('User Avatar')	                Use for elements with title attributes (e.g., tooltips).

Why Use These?
• They are human-readable and improve test stability.
• Recommended by Playwright for long-term maintainability.
• Work well across different browsers and screen readers.

2. CSS & XPath Locators
These locators are flexible but can be fragile if the UI changes frequently.

Locator	                        Example	                                                Use Case
locator() (CSS Selector/id)	    page.locator('#username')	                            Fast and widely used. Supports any CSS selector.
locator() (XPath Selector)	    page.locator('//button[text()="Login"]')	            Use if CSS selectors don’t work. Less recommended.
nth() (Index Selector)	        page.locator('button').nth(2)	                        Use to select the third button in a group.
first() (First Match Selector)	page.locator('.error-message').first()	                Selects the first matching element.
last() (Last Match Selector)	page.locator('.error-message').last()	                Selects the last matching element.
filter()	                    page.locator('button').filter({ hasText: 'Submit' })	Narrows down selection to elements containing text.

When to Use?
• Use CSS selectors when getBy*() methods aren’t available.
• XPath should be a last resort (less readable and more fragile).

3. Form-Specific Locators
These are specialized locators for handling input fields and forms.
When to Use? - Forms & Input Handling should use getByLabel() or getByPlaceholder() instead of generic selectors.
Locator	                Example	                                            Use Case
getByLabel()	        page.getByLabel('Email')	                        Best for inputs with <label> elements.
getByPlaceholder()	    page.getByPlaceholder('Enter your email')	        Use when the input has a placeholder attribute.
getByText()	            page.getByText('Submit')	                        Use for buttons or links.
getByRole('textbox')	page.getByRole('textbox', { name: 'Email' })	    Best for text inputs.
fill()	                page.locator('#email').fill('user@example.com')	    Use to enter text into input fields.
check()	                page.locator('#terms').check()	                    Use to select checkboxes or radio buttons.
selectOption()	        page.locator('select').selectOption('value1')	    Use for dropdowns.

When to Use?
• Forms & Input Handling should use getByLabel() or getByPlaceholder() instead of generic selectors.

4. Table & List Locators
These locators help when working with tables, lists, and repeating elements.
Locator	                                Example	                                        Use Case
nth()	                                page.locator('table tr').nth(1)	                Selects the second row in a table.
locator().locator() (Chained Locator)	page.locator('table').locator('tr')	            Selects all rows inside a table.
filter()	                            page.locator('li').filter({ hasText: 'Apple' })	Filters list items containing “Apple”.
hasText()	                            page.locator('td').hasText('Total')	            Selects table cells containing “Total”.

When to Use?
• When working with dynamic tables or lists.

5. Advanced Locators
These locators help in complex UI interactions.
Locator	        Example	                                        Use Case
has()	        page.locator('div').hasText('Welcome')	        Selects a <div> containing “Welcome”.
hasText()	    page.locator('button').hasText('Save')	        Selects buttons with the exact text “Save”.
or()	        page.locator('button').or(page.locator('a'))	Selects either a button or a link.
getByTestId()	page.getByTestId('login-btn')	                Use for elements with data-testid attributes.
getByRole()	    page.getByRole('button', { name: 'Continue' })	Best for buttons and links with text.

When to Use?
• For stable and future-proof locators in complex UIs.
• When dealing with multiple possible elements (or(), has()).

6. Playwright-Specific Actions
These locators are tied to specific Playwright actions.

Action	        Example	                                                Use Case
Hover	        page.locator('.menu-item').hover()	                    Use for hover-based dropdowns.
Double Click	page.locator('.edit-btn').dblclick()	                Use when a double-click is required.
Right Click	    page.locator('.file').click({ button: 'right' })	    Use for context menus.
Press Keys	    page.locator('input').press('Enter')	                Simulates keyboard input.
Drag and Drop	page.locator('#source').dragTo(page.locator('#target'))	Handles drag-and-drop UI elements.

When to Use?
• When interacting with non-standard UI elements.

Locator Strategies
Locator Type	            Example	                                    Use Case
ID	                        #email	                                    Fastest and most reliable if available
Name	                    input[name="email"]	                        Good for form elements like input fields
Class	                    .login-button	                            Use when the class is unique
Placeholder	                placeholder=Email Address	                Ideal for input fields when placeholders are stable
Text Content	            text="Login"	                            Useful for buttons, links, headings
XPath	                    xpath=//input[@name="email"]	            Last resort when no other locator works
CSS Selector	            css=[data-test="login-btn"]	                More stable than regular class selectors
Test Attribute-Based	    [data-testid="submit-button"]	            Most stable for long-term maintenance
Aria Role-Based	            role=button[name="Submit"]	                Best for accessibility-focused applications
Chained Locators	        page.locator('div').locator('button')	    Select elements within another element
Sibling Selectors	        page.locator('input >> nth=0')	            Select a specific element among siblings
Ancestor-Based Selection	xpath=//div[@id="login-form"]//button	    Select elements inside a specific ancestor

*/