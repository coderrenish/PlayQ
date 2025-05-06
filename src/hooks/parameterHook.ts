import { defineParameterType } from '@cucumber/cucumber';
// import { getVar } from '../helper/getBundle';
// const { getVar, setVar } = globalThis.getBundle;
import { vars } from '@src/global';


defineParameterType({
  name: 'param',
  regexp: /".*?"/, // Matches any quoted string
  transformer(this: any, input: string) {
    const raw = input.replace(/^"|"$/g, '').trim();
    const resolved = vars.replaceVariables(raw);
    if (typeof this?.attach === 'function') {
      this.attach(`Replaced: |${input}|-with-|${resolved}|`, 'text/plain');
    }
    return resolved;
  }
});

