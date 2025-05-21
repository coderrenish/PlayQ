Feature: Memebership Registration U Portal - GB 

@uportal_membership_gb
Scenario: Do Membership with GB
#   * Step Group: "@open.steps" "Open U Portal and Navigate to Membership"
# * Web: I open the web browser with "${env.uportal.gb.url}"
* UPORTAL-GB: Open browser and navigate to membership page "${env.uportal.gb.url}"



@uportal_membership_gb_direct
Scenario: Do Membership with GB
* Web: I open web browser with "${env.uportal.gb.url}"
* Web: Verify header text is "NTUC Membership Benefit" options: "assert: false, screenshot_text: 'testing screenshot text'"
* Web: Click button "START APPLICATION" options: ""
* Web: Verify header text is "NTUC Membership" options: ""
* Web: Click button "APPLY MANUALLY" options: ""
* Web: Verify tab selected "PERSONAL & CONTACT DETAILS" options: ""



@uportal_membership_gb_traditional
Scenario: Do Membership with GB
* Web: I open web browser with "${env.uportal.gb.url}"
* Web: Verify header text is "NTUC Membership Benefit" options: "assert: false, screenshot_text: 'testing screenshot text'"
* Web: Click button "xpath=//button[normalize-space(text())='Start Application']" options: ""
* Web: Verify header text is "NTUC Membership" options: ""
* Web: Click button "chain=div#signup-flow >> button.MuiButton-root.MuiButton-outlined" options: ""
* Web: Verify tab selected "PERSONAL & CONTACT DETAILS" options: ""

@uportal_membership_gb_locator_file
Scenario: Do Membership with GB
* Web: I open web browser with "${env.uportal.gb.url}"
* Web: Verify header text is "NTUC Membership Benefit" options: "assert: false, screenshot_text: 'testing screenshot text'"
* Web: Click button "loc.json.uportal_gb.membershipBenefitsPage.start_application" options: ""
* Web: Verify header text is "NTUC Membership" options: ""
* Web: Click button "loc.ts.uportal_gb.membershipPage.btn_apply_manually" options: ""
* Web: Verify tab selected "PERSONAL & CONTACT DETAILS" options: ""