/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppRef } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';

// Temporary solution until we found something better

export const getResourceIcons = (): string[] =>
  Object.keys(
    (resolve(AppRef).findPlugin('oryx.experienceTheme') as any).getIcons()
  );

export const getThemeGraphics = (): string[] =>
  Object.keys(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (
      resolve(AppRef).findPlugin('oryx.experienceResource') as any
    ).getResources()!.graphics!
  );
