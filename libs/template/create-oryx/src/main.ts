#!/usr/bin/env node
import { cliApp } from '@spryker-oryx/cli';
import { checkLatestVersion } from './check-version';

const args = ['create', ...process.argv.slice(2)];

checkLatestVersion().then(() => {
  cliApp({ cli: { args } }).create();
});
