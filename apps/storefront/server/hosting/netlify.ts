import { builder } from '@netlify/functions';
import { storefrontHandler } from '@spryker-oryx/application/lambda';

const handler = builder((event, context) =>
  storefrontHandler(event, {
    ...context,
    component: '<oryx-app></oryx-app>',
    ttl: 900,
  })
);

export { handler };
