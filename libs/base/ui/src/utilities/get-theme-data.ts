import { graphicInjectable, iconInjectable } from '@spryker-oryx/utilities';

export const getAppIcons = (): string[] =>
  Object.keys(iconInjectable.get()?.getIcons() ?? {});

export const getAppGraphics = (): string[] =>
  Object.keys(graphicInjectable.get()?.getGraphics() ?? {});
