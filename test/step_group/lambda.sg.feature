@StepGroup
Feature: Step Group for 

@StepGroup:lambda_reg_navigation.sg
Scenario: Navigating to Lambda Test Registration Page

    * Web: I open web browser with "${env.lambdatest.url}"
    * Web: I open web browser with "${env.lambdatest.url}"
    * Web: Verify page title is "Your store" options: "partial_check: true, case_sensitive: false"
    * Web: Mouseover on link "{{top_menu}} My account" options: ""
    * Web: Click link "Register" options: ""
    * Web: Verify header text is "Register Account" options: ""
    * Web: Wait in milliseconds "200"

@StepGroup:test.sg
Scenario: testing Step Group
    * Web: Verify header text is "Register Account" options: ""
    
