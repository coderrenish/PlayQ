const { spawn } = require('child_process');

// Support both direct ENV and --TAGS= style from npm CLI
const tags = process.env.TAGS || process.env.npm_config_TAGS || '';
const env = process.env.ENV || process.env.npm_config_ENV || '';

const args = ['cucumber-js', '--config', 'cucumber.js', '--profile', 'default'];

if (tags) args.push('--tags', tags);

const run = spawn('npx', args, {
  stdio: 'inherit',
  env: { ...process.env, ENV: env },
  shell: true
});

run.on('close', (code) => {
  process.exit(code);
});