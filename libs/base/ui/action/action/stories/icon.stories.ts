import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

import { IconTypes } from '@spryker-oryx/ui/icon';
import { ActionType } from '../action.model';
import { renderAction } from './util';

const icon = IconTypes.Star;
const text = 'text';
const type = ActionType.Icon;

export default {
  title: `${storybookPrefix}/Actions/Action`,
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` ${[renderAction({ type, text, icon })]}
    <span style="background: blue;padding: 10px;display:inline-block;">
      ${[renderAction({ type, text, icon })]}
    </span>
    <span style="color: blue"> ${[renderAction({ type, text, icon })]} </span>

    <h3>Sizes</h3>
    <span style="font-size: 12px">
      ${[renderAction({ type, text, icon })]}
    </span>
    ${[renderAction({ type, text, icon })]}
    <span style="font-size: 16px">
      ${[renderAction({ type, text, icon })]}
    </span>
    <h3>Small</h3>
    <div style="font-size: 12px">
      <p>This is small text</p>
      ${[renderAction({ type, text, icon })]}
    </div>
    <h3>Medium (default)</h3>
    <div>
      <p>This is medium text</p>
      ${[renderAction({ type, text, icon })]}
    </div>
    <h3>Large</h3>
    <div style="font-size: 16px">
      <p>This is large text</p>
      ${[renderAction({ type, text, icon })]}
    </div>
    <style></style>`;
};

export const Icon = Template.bind({});
