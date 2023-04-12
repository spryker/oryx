#!/usr/bin/env node

import { cliApp } from '@spryker-oryx/cli';

cliApp.withOptions({ cli: { args: process.argv.slice(2) } }).create();
