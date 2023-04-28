/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppRef } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';

// Temporary solution until we found something better

export const getThemeIcons = (): string[] =>
  Object.keys(
    (resolve(AppRef).findPlugin('oryx.experience$theme') as any).getIcons()
  );

export const getThemeGraphics = (): string[] =>
  Object.keys(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (
      resolve(AppRef).findPlugin('oryx.experience$resource') as any
    ).getResources()!.graphics!
  );
