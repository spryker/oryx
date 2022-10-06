import {
  generateVariantsMatrix,
  storybookDefaultViewports,
} from '@spryker-oryx/ui/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { QuantityInputComponent } from '../../quantity-input.component';
import { CategoryY, getInputVariants } from './common';

export default {
  title: `${storybookPrefix}/Quantity input/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  const interval = setInterval(() => {
    if (!customElements.get('quantity-input')) {
      return;
    }

    clearInterval(interval);

    const elements: NodeListOf<QuantityInputComponent> =
      document.querySelectorAll('quantity-input');

    elements.forEach((element) => {
      const state = (element as HTMLElement).dataset.state;
      const disabled = (element as HTMLElement).dataset.disabled;

      if (!state && !disabled) {
        return;
      }

      const [selector, childSelector] = (
        (element as HTMLElement).dataset.selector as string
      ).split(' ');

      const target = childSelector
        ? element.shadowRoot?.querySelector(selector)
        : element;

      if (state) {
        target?.shadowRoot
          ?.querySelector(childSelector ?? selector)
          ?.classList.add(...state.split(' '));
      }

      if (disabled) {
        target?.shadowRoot
          ?.querySelector(childSelector ?? selector)
          ?.setAttribute('disabled', '');
      }
    });
  }, 100);

  const getSelector = (categoryY: CategoryY, isDisabled: boolean): string => {
    switch (categoryY) {
      case CategoryY.Decrease:
        return 'button:first-child';
      case CategoryY.Input:
        return isDisabled ? 'input' : 'oryx-input .control';
      case CategoryY.Increase:
        return 'button:last-child';
    }
  };

  return html`
    ${generateVariantsMatrix(
      Object.values(CategoryY).reduce(
        (result, v) => [...result, ...getInputVariants(v)] as any,
        []
      ) as any,
      ({ categoryY, options: { isDisabled, className } }) => html`
        <quantity-input
          data-selector=${getSelector(
            categoryY as CategoryY,
            isDisabled as boolean
          )}
          data-state=${className as string}
          data-disabled=${isDisabled as boolean}
          min=${0}
          value=${1}
        ></quantity-input>
      `
    )}
  `;
};
export const States = Template.bind({});

States.parameters = {
  chromatic: {
    delay: 3000,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};
