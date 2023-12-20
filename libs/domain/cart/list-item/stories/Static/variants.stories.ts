import { Meta, Story } from '@storybook/web-components';
import { LitElement, TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/List Item`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h4>Default</h4>
    <oryx-cart-list-item cartId="default"></oryx-cart-list-item>

    <h4>Default opened</h4>
    <oryx-cart-list-item cartId="default" class="open"></oryx-cart-list-item>

    <h4>Empty</h4>
    <oryx-cart-list-item cartId="empty"></oryx-cart-list-item>

    <h4>Empty opened</h4>
    <oryx-cart-list-item cartId="empty" class="open"></oryx-cart-list-item>

    <h4>Net price mode</h4>
    <oryx-cart-list-item cartId="net"></oryx-cart-list-item>

    <h4>Net price mode opened</h4>
    <oryx-cart-list-item cartId="net" class="open"></oryx-cart-list-item>

    <h4>Multiple entries</h4>
    <oryx-cart-list-item cartId="multiple"></oryx-cart-list-item>

    <h4>Multiple entries opened</h4>
    <oryx-cart-list-item cartId="multiple" class="open"></oryx-cart-list-item>
  `;
};

export const Static = Template.bind({});

Static.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  await Promise.all([
    customElements.whenDefined('oryx-cart-list-item'),
    customElements.whenDefined('oryx-collapsible'),
  ]);

  const opened = obj.canvasElement.querySelectorAll<LitElement>('.open');

  opened.forEach((element) => {
    if (!element.shadowRoot) return;

    const observer = new MutationObserver((mutationList, observer) => {
      const collapsible = element.renderRoot.querySelector('oryx-collapsible');
      if (collapsible) {
        collapsible.toggleAttribute('open', true);
        observer.disconnect();
      }
    });

    observer.observe(element.shadowRoot, { childList: true });
  });
};
