/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: require.resolve('../.env.netlify-test') });
const serverless = require('serverless-http');
const { createMockServer } = require('../mock/server');

exports.handler = serverless(createMockServer());

try {
  require('../.env.netlify-test');
} catch {
  // Hack to force the file to be included by Netlify build
}
