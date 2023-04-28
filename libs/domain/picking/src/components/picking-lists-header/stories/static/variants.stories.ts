import { MockDateDecorator, storybookDefaultViewports } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, LitElement, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Picking List Header/Static`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
  decorators: [MockDateDecorator(new Date('March 20, 2020 20:00:00'))],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h2>Default</h2>
    <oryx-picking-lists-header></oryx-picking-lists-header>

    <h2>Search opened</h2>
    <oryx-picking-lists-header id="search-opened"></oryx-picking-lists-header>
  `;
};

export const Variants = Template.bind({});

Variants.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  await customElements.whenDefined('oryx-picking-lists-header');
  const searchOpened =
    obj.canvasElement.querySelector<LitElement>('#search-opened');
  searchOpened?.renderRoot
    .querySelector('oryx-search')
    ?.toggleAttribute('open', true);
};
