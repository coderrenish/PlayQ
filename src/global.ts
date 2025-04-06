import * as vars from './helper/bundle/vars';
import { loc } from './helper/loc';
import { uiFixture } from './hooks/uiFixture'; 
import { logFixture } from './hooks/logFixture';

globalThis.runType = process.env.TEST_TYPE || 'ui';

globalThis.vars = vars;
globalThis.loc = loc;
globalThis.uiFixture = uiFixture;
globalThis.logFixture = logFixture;


export { vars, loc, uiFixture, logFixture };