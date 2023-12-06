import { ElementDefinition } from '@spryker-oryx/core';

/**
 * Icons for both light and dark mode.
 *
 * The icons are in (base64) SVG, so that they will scale to different sizes. The default icon is used by
 * various OS specific features, such as pinned tabs, taskbars, etc.
 *
 * While an SVG based icon can handle light and dark mode, the color is not refreshed when the device mode
 * changes. Therefore, we need to provide a separate icon for dark mode.
 */
export const iconMeta = (): ElementDefinition[] => [
  {
    name: 'link',
    attrs: { rel: 'icon', href: '/public/icon.svg' },
  },
  {
    name: 'link',
    attrs: {
      rel: 'icon',
      href: '/public/icon.svg',
      media: '(prefers-color-scheme: dark)',
    },
  },
];

export const fontMeta = (): ElementDefinition[] => [
  {
    name: 'link',
    attrs: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
      media: 'all',
    },
  },
];

export const bodyStyles = (
  config: { fontSize: string } = { fontSize: '14px' }
): ElementDefinition[] => [
  {
    name: 'style',
    attrs: { text: `:root{font-size:${config.fontSize}}body {margin: 0;}` },
  },
];
