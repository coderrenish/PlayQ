@lambda_reg_navigation.steps/
* Web: I open web browser with "${env.lambdatest.url}"
* Web: Verify page title is "Your store" options: "partial_check: true, case_sensitive: false"
* Web: Mouseover on link "{{top_menu}} My account" options: ""
* Web: Click link "Register" options: ""
* Web: Verify header text is "Register Account" options: ""
@/lambda_reg_navigation.steps

