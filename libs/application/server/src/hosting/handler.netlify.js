import { builder } from '@netlify/functions';
import { storefrontHandler } from './handler.lambda';

const handler = builder(storefrontHandler);

export { handler };
