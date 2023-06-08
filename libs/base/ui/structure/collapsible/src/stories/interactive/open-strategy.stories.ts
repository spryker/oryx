import { wait } from '@spryker-oryx/utilities';
import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { CollapsibleComponent } from '../../index';

export default {
  title: `${storybookPrefix}/Structure/Collapsible/Interactive`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` <oryx-collapsible heading="Heading">Content</oryx-collapsible> `;
};

export const OpenStrategy = Template.bind({});

OpenStrategy.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const collapsible = obj.canvasElement.querySelector(
    'oryx-collapsible'
  ) as CollapsibleComponent;
  const details = collapsible.shadowRoot?.querySelector(
    'details'
  ) as HTMLElement;
  const summary = collapsible.shadowRoot?.querySelector(
    'summary'
  ) as HTMLElement;

  await wait(1000);
  userEvent.click(summary);
  await wait(0);
  expect(details?.hasAttribute('open')).toBeTruthy;
};
