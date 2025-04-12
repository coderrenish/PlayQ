import type * as varsType from './helper/bundle/vars';
import type { locPattern as locPatternType } from './helper/locPattern';
import type { webFixture as webFixtureType } from './helper/fixtures/webFixture'; // ✅ Use the actual type
import type { logFixture as logFixtureType } from './helper/fixtures/logFixture';

export {};

declare global {
  var runType: 'ui' | 'api' | 'mobile';
  var vars: typeof varsType;
  var locPattern: typeof locPatternType;
  var webFixture: typeof webFixtureType; // ✅ Use the actual type
  var logFixture: typeof logFixtureType;
}


// import type * as getBundleType from './helper/getBundle';
// import type { loc as locType } from './helper/loc';
// import type { Locator } from '@playwright/test';

// export {};

// declare global {
//   var getBundle: typeof getBundleType;
//   var loc: typeof locType;
// }