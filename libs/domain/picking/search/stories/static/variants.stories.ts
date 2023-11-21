import {
  MockDateDecorator,
  storybookDefaultViewports,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { LitElement, TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Static`,
  parameters: {
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
  decorators: [MockDateDecorator()],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h2>Default</h2>
    <oryx-picking-search></oryx-picking-search>

    <h2>Search opened</h2>
    <oryx-picking-search id="search-opened"></oryx-picking-search>
  `;
};

export const Variants = Template.bind({});

Variants.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  await Promise.all([
    customElements.whenDefined('oryx-picking-search'),
    customElements.whenDefined('oryx-search'),
  ]);
  const searchOpened =
    obj.canvasElement.querySelector<LitElement>('#search-opened');

  searchOpened?.renderRoot
    .querySelector('oryx-search')
    ?.toggleAttribute('open', true);
};
