#!/usr/bin/env node

import { cliApp } from '../src/app.js';

cliApp({ cli: { args: process.argv.slice(2) } }).create();
