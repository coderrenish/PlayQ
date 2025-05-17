import type * as varsType from '../bundle/vars';
import type { locPattern as locPatternType } from '../loc/webLocPattern';
import type { webFixture as webFixtureType } from '../fixtures/webFixture'; 
import type { logFixture as logFixtureType } from '../fixtures/logFixture';
import * as utilsType from '../util/utils';
import { faker as fakerType } from '../faker/customFaker';


export {};

declare global {
  var runType: 'ui' | 'api' | 'mobile';
  var vars: typeof varsType;
  var locPattern: typeof locPatternType;
  var webFixture: typeof webFixtureType; 
  var logFixture: typeof logFixtureType;
  var utils: typeof utilsType;
  var faker: typeof fakerType;
}


// import type * as getBundleType from './helper/getBundle';
// import type { loc as locType } from './helper/loc';
// import type { Locator } from '@playwright/test';

// export {};

// declare global {
//   var getBundle: typeof getBundleType;
//   var loc: typeof locType;
// }