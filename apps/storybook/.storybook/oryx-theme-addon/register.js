import { addons, types } from '@storybook/addons';
import { ThemeSelector } from './theme-selector';
// organize-imports-ignore
import React from 'react';

const ADDON_ID = 'storybook/oryx-theme-addon';

addons.register(ADDON_ID, (api) => {
  addons.add(ADDON_ID, {
    title: 'Outline',
    type: types.TOOL,
    render: () => <ThemeSelector api={api} />,
  });
});
