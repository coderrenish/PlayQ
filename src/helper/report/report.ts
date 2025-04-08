const report = require("multiple-cucumber-html-reporter");
import * as fs from 'fs';

const jsonPath = 'test-results/cucumber-report.json';
if (!fs.existsSync(jsonPath)) {
  console.warn("⚠️ cucumber-report.json not found.");
  const files = fs.readdirSync('test-results');
  console.warn("📁 test-results folder contains:", files);
} else {
//   console.log("✅ cucumber-report.json found");
  // 💡 Load JSON, patch paths, save back
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);
  data.forEach((feature: any) => {
    if (feature.uri?.startsWith('_TEMP/execution/')) {
      feature.uri = feature.uri.replace('_TEMP/execution/', '');
    }
  });
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2)); // Save the cleaned version
}

// Removing "_TEMP/execution/" from cucumber-report.html
const htmlReportPath = 'test-results/cucumber-report.html';
if (fs.existsSync(htmlReportPath)) {
  let html = fs.readFileSync(htmlReportPath, 'utf-8');
  const updatedHtml = html.replaceAll('_TEMP/execution/', '');

  fs.writeFileSync(htmlReportPath, updatedHtml, 'utf-8');
  console.log("🧼 Cleaned cucumber-report.html by removing '_TEMP/execution/'");
} else {
  console.warn("⚠️ cucumber-report.html not found.");
}

report.generate({
    jsonDir: "test-results",
    reportPath: "test-results/reports/",
    reportName: "Playwright Automation Report",
    pageTitle: "BookCart App test report",
    displayDuration: false,
    metadata: {
        browser: {
            name: "chrome",
            version: "112",
        },
        device: "Koushik - PC",
        platform: {
            name: "Windows",
            version: "10",
        },
    },
    customData: {
        title: "Test Info",
        data: [
            { label: "Project", value: "Book Cart Application" },
            { label: "Release", value: "1.2.3" },
            { label: "Cycle", value: "Smoke-1" }
        ],
    },
});