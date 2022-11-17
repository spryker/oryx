import { DesignToken } from '@spryker-oryx/core';
import { backofficeTokens } from '../backoffice';

export const launchpadTokens: DesignToken[] = backofficeTokens.filter(
  (tokens) => !tokens.media?.mode
);
