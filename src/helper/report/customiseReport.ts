import fs from 'fs';

const inputPath = 'test-results/cucumber-report.json';
const outputPath = 'test-results/cucumber-report-custom.json';

function extractReplacements(embeddings: any[]): Record<string, string> {
  const replacements: Record<string, string> = {};
  embeddings?.forEach(embed => {
    const data = embed?.data;
    const match = data?.match(/Replaced: \|\\?"(.*?)\\?"\|-with-\|(.*?)\|/);
    if (match) {
      const original = match[1];
      const replaced = match[2];
      replacements[original] = replaced;
    }
  });
  return replacements;
}

function updateStepName(step: any) {
  const replacements = extractReplacements(step.embeddings || []);
  for (const [original, replaced] of Object.entries(replacements)) {
    const quotedOriginal = `"${original}"`;
    const quotedReplaced = `"${replaced}"`;
    step.name = step.name.replace(quotedOriginal, quotedReplaced);
  }
}

function processReport() {
  const raw = fs.readFileSync(inputPath, 'utf-8');
  const report = JSON.parse(raw);

  for (const feature of report) {
    for (const scenario of feature.elements || []) {
      for (const step of scenario.steps || []) {
        updateStepName(step);
      }
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✅ Updated report written to ${outputPath}`);
}

processReport();