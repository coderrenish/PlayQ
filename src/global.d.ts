import type * as varsType from './helper/bundle/vars';
import type { loc as locType } from './helper/loc';
import type { webFixture as webFixtureType } from './hooks/webFixture'; // ✅ Use the actual type
import type { logFixture as logFixtureType } from './hooks/logFixture';

export {};

declare global {
  var runType: 'ui' | 'api' | 'mobile';
  var vars: typeof varsType;
  var loc: typeof locType;
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