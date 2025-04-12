import * as vars from './helper/bundle/vars';
import { locPattern } from './helper/sml/locPattern';
import { webFixture } from './helper/fixtures/webFixture'; 
import { logFixture } from './helper/fixtures/logFixture';

globalThis.runType = process.env.TEST_TYPE || 'ui';

globalThis.vars = vars;
globalThis.locPattern = locPattern;
globalThis.uiFixture = webFixture;
globalThis.logFixture = logFixture;


export { vars, locPattern, webFixture, logFixture };