import { addons, types } from '@storybook/addons';
import { ThemeSelector } from './theme-selector';
import { ResourceSelector } from './resource-selector';
// organize-imports-ignore
import React from 'react';

const ADDON_ID = 'storybook/oryx-addon';

addons.register(ADDON_ID, (api) => {
  addons.add(`${ADDON_ID}-theme`, {
    title: 'Outline',
    type: types.TOOL,
    render: () => <ThemeSelector api={api} />,
  });
  addons.add(`${ADDON_ID}-resource`, {
    title: 'Outline',
    type: types.TOOL,
    render: () => <ResourceSelector api={api} />,
  });
});
