import * as vars from './helper/bundle/vars';
// import { locPattern } from './helper/sml/locPattern';
import { webFixture } from './helper/fixtures/webFixture'; 
import { logFixture } from './helper/fixtures/logFixture';
import * as utils from './helper/util/utils';
import { faker } from '@helper/faker/customFaker';
import { webLocResolver } from './helper/loc/webLocResolver';
import { webLocPattern } from './helper/loc/webLocPattern'; // Importing locPattern for location pattern matching

// Removed redundant import for loc; using locPattern instead


const testType = process.env.TEST_TYPE;
const allowedTypes = ['ui', 'api', 'mobile'] as const;

globalThis.runType = allowedTypes.includes(testType as any)
  ? (testType as typeof allowedTypes[number])
  : 'ui';

globalThis.vars = vars;
// globalThis.locPattern = locPattern;
globalThis.webLocPattern = webLocPattern;
globalThis.webLocResolver = webLocResolver;
globalThis.uiFixture = webFixture;
globalThis.logFixture = logFixture;
globalThis.utils = utils;
globalThis.faker = faker;




export { vars, webLocPattern, webLocResolver, webFixture, logFixture, utils, faker };