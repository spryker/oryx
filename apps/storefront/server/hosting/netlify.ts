import { builder } from '@netlify/functions';
import { storefrontHandler } from '@spryker-oryx/application/lambda';

const handler = builder(storefrontHandler);

export { handler };
