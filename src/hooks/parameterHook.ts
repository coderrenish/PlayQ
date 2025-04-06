import { defineParameterType } from '@cucumber/cucumber';
// import { getVar } from '../helper/getBundle';
// const { getVar, setVar } = globalThis.getBundle;
import { vars } from '@src/global';
const { getVar } = vars;


defineParameterType({
  name: 'param',
  regexp: /".*?"/, // Matches any quoted string
  transformer(input: string) {
    const raw = input.replace(/^"|"$/g, '').trim();

    const varMatch = raw.match(/^\$\{(.+?)\}$/); // Match ${...}
    if (varMatch) {
      const key = varMatch[1];
      return getVar(key); // Fetch from getBundle (static or runtime)
    }
    return raw;
  }
});

