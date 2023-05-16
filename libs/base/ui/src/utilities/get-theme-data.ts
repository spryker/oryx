/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppRef } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';

// Temporary solution until we found something better

export const getResourceIcons = (): string[] =>
  Object.keys(
    (resolve(AppRef).requirePlugin('oryx.experienceResource') as any).getIcons()
  );

export const getThemeGraphics = (): string[] =>
  Object.keys(
    (
      resolve(AppRef).requirePlugin('oryx.experienceResource') as any
    ).getGraphics()
  );
