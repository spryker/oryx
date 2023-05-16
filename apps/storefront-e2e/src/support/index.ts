import './commands';

const origLog = Cypress.log;

// removes useless log messages from cypress runner
Cypress.log = function (opts: any, ...other) {
  if (opts.url) {
    // this request is being intercepted
    // and this log prevents Cypress bug with missing log on interceptor
    if (opts.url.includes('/youtubei/v1/next')) {
      return origLog(opts, ...other);
    }

    if (opts.url.includes('google') || opts.url.includes('youtube')) {
      return;
    }
  }

  return origLog(opts, ...other);
};
