import { BeforeAll, Before, After, AfterAll } from '@cucumber/cucumber';
import { setupEnvAndBrowser, shutdownBrowser } from './testLifecycleHooks';
import { handleScenarioSetup } from './scenarioHooks';
import { handleScenarioTeardown } from './supportHooks';
import { web } from "@actions";

import './parameterHook';

BeforeAll(async function () {
  await setupEnvAndBrowser();
});

Before({ tags: 'not @auth' }, async function (ctx) {
  await handleScenarioSetup(ctx, false);
  web.setAttachFn(this.attach); 
});

Before({ tags: '@auth' }, async function (ctx) {
  await handleScenarioSetup(ctx, true);
  web.setAttachFn(this.attach); 
});

After(async function (ctx) {
  await handleScenarioTeardown.call(this, ctx);
});

AfterAll(async function () {
  await shutdownBrowser();
});


// import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
// import { Browser, BrowserContext } from "@playwright/test";
// // import { fixture } from "./pageFixture";
// import { invokeBrowser } from "../helper/browsers/browserManager";
// import { getEnv } from "../helper/env/env";
// import { createLogger } from "winston";
// import { options } from "../helper/util/logger";
// import './parameterHook';
// import '../helper/report/init';
// import { webFixture, logFixture } from '@src/global';
// import { World } from '@cucumber/cucumber';


// const fs = require("fs-extra");



// // let browser: Browser;
// let context: BrowserContext;

// BeforeAll(async function () {
//     getEnv();
//     console.log("runType:", globalThis.runType);
//     // browser = await invokeBrowser();\
//     if (globalThis.runType === 'ui') {
//         // browser = await invokeBrowser();
//         await webFixture.launchBrowser();
//       }
// });
// // It will trigger for not auth scenarios
// Before({ tags: "not @auth" }, async function ({ pickle }) {
//     const scenarioName = pickle.name + pickle.id;

//     logFixture.init(scenarioName);
//     logFixture.setLogger(logFixture.get());

//     if (globalThis.runType !== 'ui') return;

//     context = await webFixture.newContext()

//     await webFixture.getContext().tracing.start({
//         name: scenarioName,
//         title: pickle.name,
//         sources: true,
//         screenshots: true,
//         snapshots: true,
//     });

//     await webFixture.newPage(); // uses 'main' as default
//     console.log("✅ Page set in Before hook in non-auth");
// });


// // It will trigger for auth scenarios
// Before({ tags: '@auth' }, async function ({ pickle }) {
//     const scenarioName = pickle.name + pickle.id;

//     logFixture.init(scenarioName);
//     logFixture.setLogger(logFixture.get());

//     if (globalThis.runType !== 'ui') return;

//     // context = await browser.newContext({
//     //     recordVideo: {
//     //     dir: "test-results/videos",
//     //     },
//     // });

//     // await context.tracing.start({
//     //     name: scenarioName,
//     //     title: pickle.name,
//     //     sources: true,
//     //     screenshots: true,
//     //     snapshots: true,
//     // });
//     context = await webFixture.newContext()
//     await webFixture.getContext().tracing.start({
//         name: scenarioName,
//         title: pickle.name,
//         sources: true,
//         screenshots: true,
//         snapshots: true,
//     });
// //   const page = await context.newPage();
//     await webFixture.newPage(); // uses 'main' as default
//     console.log("✅ Page set in Before hook in auth");
// });

// After(async function ({ pickle, result }) {
//     let videoPath: string;
//     let img: Buffer;
//     const path = `./test-results/trace/${pickle.id}.zip`;
  
//     if (globalThis.runType !== 'ui' && globalThis.runType !== 'mobile') return;
  
//     if (result?.status === Status.PASSED) {
//       img = await webFixture.getCurrentPage().screenshot({
//         path: `./test-results/screenshots/${pickle.name}.png`,
//         type: "png",
//       });
//       videoPath = await webFixture.getCurrentPage().video().path();
  
//       await this.attach(img, "image/png");
//       await this.attach(fs.readFileSync(videoPath), 'video/webm');
//       await this.attach(
//         `<a href="https://trace.playwright.dev/">Open ${path}</a>`,
//         'text/html'
//       );
//     }
  
//     // ✅ Always stop tracing and close context/page
//     await webFixture.getContext().tracing.stop({ path: path });
  
//     if (webFixture.getCurrentPage()) {
//       await webFixture.getCurrentPage().close();
//     }
  
//     if (webFixture.getContext()) {
//       await webFixture.getContext().close();
//     }
//   });

// // After(async function ({ pickle, result }) {
// //     let videoPath: string;
// //     let img: Buffer;
// //     const path = `./test-results/trace/${pickle.id}.zip`;
// //     if (result?.status == Status.PASSED) {
// //         img = await webFixture.getCurrentPage().screenshot(
// //             { path: `./test-results/screenshots/${pickle.name}.png`, type: "png" })
// //         videoPath = await webFixture.getCurrentPage().video().path();
// //     }
// //     if (globalThis.runType !== 'ui' && globalThis.runType !== 'mobile') return;

// //     if (result?.status == Status.PASSED) {
// //         await this.attach(
// //             img, "image/png"
// //         );
// //         await this.attach(
// //             fs.readFileSync(videoPath),
// //             'video/webm'
// //         );
// //         const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`
// //         await this.attach(`Trace file: ${traceFileLink}`, 'text/html');
// //     }
// //     if (globalThis.runType !== 'ui') {
// //         await webFixture.getContext().tracing.stop({ path: path });
// //         await webFixture.getCurrentPage().close();
// //         await webFixture.getContext().close();
// //     };
// // });
// // After(async function (this: World) {
// //     const page = webFixture.getCurrentPage();
  
// //     if (page && !page.isClosed()) {
// //       const video = page.video();
// //       const videoPath = await video?.path();
// //       if (videoPath && fs.existsSync(videoPath)) {
// //         const buffer = fs.readFileSync(videoPath);
// //         this.attach(buffer, "video/webm");
// //       } else {
// //         console.warn(`⚠️ Video file not found at: ${videoPath}`);
// //       }
// //     } else {
// //       console.warn("⚠️ Page was already closed before After hook.");
// //     }
  
// //     await webFixture.closeContext(); // move this out of step-def timing
// //   });

// AfterAll(async function () {
//     // await browser.close();
//     if (globalThis.runType !== 'ui') { await webFixture.closeAll(); };
        
// })

// function getStorageState(user: string): string | { cookies: { name: string; value: string; domain: string; path: string; expires: number; httpOnly: boolean; secure: boolean; sameSite: "Strict" | "Lax" | "None"; }[]; origins: { origin: string; localStorage: { name: string; value: string; }[]; }[]; } {
//     if (user.endsWith("admin"))
//         return "src/helper/auth/admin.json";
//     else if (user.endsWith("lead"))
//         return "src/helper/auth/lead.json";
// }


