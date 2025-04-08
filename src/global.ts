import * as vars from './helper/bundle/vars';
import { loc } from './helper/loc';
import { webFixture } from './hooks/webFixture'; 
import { logFixture } from './hooks/logFixture';

globalThis.runType = process.env.TEST_TYPE || 'ui';

globalThis.vars = vars;
globalThis.loc = loc;
globalThis.uiFixture = webFixture;
globalThis.logFixture = logFixture;


export { vars, loc, webFixture, logFixture };