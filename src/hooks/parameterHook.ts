import { defineParameterType } from '@cucumber/cucumber';
// import { getVar } from '../helper/getBundle';
// const { getVar, setVar } = globalThis.getBundle;
import { vars } from '@src/global';


defineParameterType({
  name: 'param',
  regexp: /".*?"/, // Matches any quoted string
  transformer(input: string) {
    const raw = input.replace(/^"|"$/g, '').trim();
    return vars.replaceVariables(raw);
  }
});

