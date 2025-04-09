import { Browser, BrowserContext, Page, Frame } from "@playwright/test";
import { Logger } from "winston";
import { invokeBrowser } from "@helper/browsers/browserManager";

const pages = new Map<string, Page>();
const frames = new Map<string, Frame>();
let currentPage: Page | undefined;
let currentFrame: Frame | undefined;
let logger: Logger;
let currentPageName = "main";
let browser: Browser;
let context: BrowserContext;

export const webFixture = {
  pages,
  frames,
  async launchBrowser() {
    browser = await invokeBrowser();
  },
  async newContext(options?: Parameters<Browser["newContext"]>[0]) {
    if (!options) {
        options = {
            recordVideo: {
            dir: "test-results/videos",
            },
        };
    }   
    context = await browser.newContext(options);
    return context;
  },
  async newPage(name = "main") {
    const page = await context.newPage();
    pages.set(name, page);
    currentPage = page;
    currentPageName = name;
    return page;
  },
  getBrowser() {
    return browser;
  },
  getContext() {
    return context;
  },
  getCurrentPage(): Page | undefined {
    return currentPage;
  },
  setCurrentPage(name: string) {
    currentPage = pages.get(name);
    currentPageName = name;
  },
  async closeContext() {
    if (context) {
      await context.close();
    }
  },
  async closeAll() {
    await context?.close();
    await browser?.close();
  },
  // other frame helpers remain the same
};


async function createContextWithDefaults(scenarioName: string): Promise<BrowserContext> {
    const ctx = await browser.newContext({
      recordVideo: {
        dir: "test-results/videos",
      },
    });
  
    await ctx.tracing.start({
      name: scenarioName,
      title: scenarioName,
      sources: true,
      screenshots: true,
      snapshots: true,
    });
  
    return ctx;
  }

// import { Page, Frame } from "@playwright/test";
// import { Logger } from "winston";
// import { invokeBrowser } from "@helper/browsers/browserManager";


// const pages = new Map<string, Page>();
// const frames = new Map<string, Frame>();
// let currentPage: Page | undefined;
// let currentFrame: Frame | undefined;
// let logger: Logger;
// let currentPageName: string = "main";

// export const uiFixture = {
//     pages,
//     frames,
//     setPage(page: Page) {
//         pages.set(currentPageName, page);
//     },
//     setPageWithName(name: string, page: Page) {
//         pages.set(name, page);
//         currentPage = page;
//         currentPageName = name;
//     },
//     getPage(name: string): Page | undefined {
//         return pages.get(name);
//     },
//     setCurrentPage(name: string) {
//         currentPage = pages.get(name);
//         currentPageName = name;
//     },
//     getCurrentPage(): Page | undefined {
//         return currentPage;
//     },
//     getCurrentPageName(): string {
//         return currentPageName;
//     },
//     setFrame(name: string, frame: Frame) {
//         frames.set(name, frame);
//         currentFrame = frame;
//     },
//     getFrame(name: string): Frame | undefined {
//         return frames.get(name);
//     },
//     setCurrentFrame(name: string) {
//         currentFrame = frames.get(name);
//     },
//     getCurrentFrame(): Frame | undefined {
//         return currentFrame;
//     },
//     setLogger(log: Logger) {
//         logger = log;
//     },
//     getLogger(): Logger {
//         return logger;
//     }
// };









// import { Page } from "@playwright/test";
// import { Logger } from "winston";

// export const fixture = {
//     // @ts-ignore
//     page: undefined as Page,
//     logger: undefined as Logger
// }