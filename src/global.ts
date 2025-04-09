import * as vars from './helper/bundle/vars';
import { locPattern } from './helper/locPattern';
import { webFixture } from './hooks/webFixture'; 
import { logFixture } from './hooks/logFixture';

globalThis.runType = process.env.TEST_TYPE || 'ui';

globalThis.vars = vars;
globalThis.locPattern = locPattern;
globalThis.uiFixture = webFixture;
globalThis.logFixture = logFixture;


export { vars, locPattern, webFixture, logFixture };