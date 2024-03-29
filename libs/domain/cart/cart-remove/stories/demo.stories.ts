import { OverlaysDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { LitElement, TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Remove Cart`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` <oryx-cart-remove></oryx-cart-remove> `;
};

export const Demo = Template.bind({});

Demo.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  await Promise.all([
    customElements.whenDefined('oryx-cart-remove'),
    customElements.whenDefined('oryx-button'),
  ]);

  const element =
    obj.canvasElement.querySelector<LitElement>('oryx-cart-remove');

  element?.renderRoot.querySelector<LitElement>('oryx-button')?.click();
};
