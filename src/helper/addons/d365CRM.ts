import { vars, webFixture,utils,faker,logFixture,webLocPattern  } from "@src/global";
import { web } from "@actions";
import { Given, When, Then } from "@cucumber/cucumber";

const { getValue, setValue } = vars;

Given("D365CRM: I I test {param} and {param}", async function (username, password) {
  await d365crm.d365LoginTestStep(username, password);
});


class D365CRM {
  async d365LoginTestStep(username, password) {
    console.log("✅ D365 Step matched");
    console.log(`👀👀👀👀👀 ${username} = ${password} 👀👀👀`);
  }
  async d365Input(input) {
    console.log("✅ D365 input Step matched");
    console.log(`👀👀👀👀👀 ${input} 👀👀👀`);
  }
}

const d365crm = new D365CRM();
export default d365crm;