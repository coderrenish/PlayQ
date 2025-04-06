import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext } from "@playwright/test";
// import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";
import './parameterHook';
import '../helper/report/init';
import { vars, loc, uiFixture, logFixture } from '@src/global';


const fs = require("fs-extra");



// let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
    getEnv();
    console.log("runType:", globalThis.runType);
    // browser = await invokeBrowser();\
    if (globalThis.runType === 'ui') {
        // browser = await invokeBrowser();
        await uiFixture.launchBrowser();
      }
});
// It will trigger for not auth scenarios
Before({ tags: "not @auth" }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id;

    logFixture.init(scenarioName);
    uiFixture.setLogger(logFixture.get());

    if (globalThis.runType !== 'ui') return;

    context = await uiFixture.newContext()

    await uiFixture.getContext().tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true,
        snapshots: true,
    });

    await uiFixture.newPage(); // uses 'main' as default
    console.log("✅ Page set in Before hook in non-auth");
});


// It will trigger for auth scenarios
Before({ tags: '@auth' }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id;

    logFixture.init(scenarioName);
    uiFixture.setLogger(logFixture.get());

    if (globalThis.runType !== 'ui') return;

    // context = await browser.newContext({
    //     recordVideo: {
    //     dir: "test-results/videos",
    //     },
    // });

    // await context.tracing.start({
    //     name: scenarioName,
    //     title: pickle.name,
    //     sources: true,
    //     screenshots: true,
    //     snapshots: true,
    // });
    context = await uiFixture.newContext()
    await uiFixture.getContext().tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true,
        snapshots: true,
    });
//   const page = await context.newPage();
    await uiFixture.newPage(); // uses 'main' as default
    console.log("✅ Page set in Before hook in auth");
});

After(async function ({ pickle, result }) {
    let videoPath: string;
    let img: Buffer;
    const path = `./test-results/trace/${pickle.id}.zip`;
    if (result?.status == Status.PASSED) {
        img = await uiFixture.getCurrentPage().screenshot(
            { path: `./test-results/screenshots/${pickle.name}.png`, type: "png" })
        videoPath = await uiFixture.getCurrentPage().video().path();
    }
    if (globalThis.runType !== 'ui' && globalThis.runType !== 'mobile') return;

    if (result?.status == Status.PASSED) {
        await this.attach(
            img, "image/png"
        );
        await this.attach(
            fs.readFileSync(videoPath),
            'video/webm'
        );
        const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`
        await this.attach(`Trace file: ${traceFileLink}`, 'text/html');
    }
    if (globalThis.runType !== 'ui') {
        await uiFixture.getContext().tracing.stop({ path: path });
        await uiFixture.getCurrentPage().close();
        await uiFixture.getContext().close();
    };



});

AfterAll(async function () {
    // await browser.close();
    if (globalThis.runType !== 'ui') { await uiFixture.closeAll(); };
        
})

function getStorageState(user: string): string | { cookies: { name: string; value: string; domain: string; path: string; expires: number; httpOnly: boolean; secure: boolean; sameSite: "Strict" | "Lax" | "None"; }[]; origins: { origin: string; localStorage: { name: string; value: string; }[]; }[]; } {
    if (user.endsWith("admin"))
        return "src/helper/auth/admin.json";
    else if (user.endsWith("lead"))
        return "src/helper/auth/lead.json";
}


