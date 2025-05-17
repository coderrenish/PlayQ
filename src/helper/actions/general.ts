import { Given, When, Then } from "@cucumber/cucumber";

Given("Step Group: {param} {param}", async function (stepGroupName, stepGroupDesc) {
  console.error(`❌ Step Group not available: ${stepGroupName} | ${stepGroupDesc}`);
});

Given("- Step Group - START: {param} {param}", async function (stepGroupName, stepGroupDesc) {
  console.log(`-> Step Group [START]: ${stepGroupName} | ${stepGroupDesc}`);
});

Given("- Step Group - END: {param} {param}", async function (stepGroupName, stepGroupDesc) {
  console.log(`-> Step Group [END]: ${stepGroupName} | ${stepGroupDesc}`);

});