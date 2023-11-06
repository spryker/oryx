import {
  generateVariantsMatrix,
  storybookDefaultViewports,
  variantsGroupTemplate,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { QuantityInputComponent } from '../../quantity-input.component';
import { CategoryY, getInputVariants, groups } from './common';

export default {
  title: `${storybookPrefix}/Quantity input/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  const interval = setInterval(() => {
    if (!customElements.get('oryx-quantity-input')) {
      return;
    }

    clearInterval(interval);

    const elements: NodeListOf<QuantityInputComponent> =
      document.querySelectorAll('oryx-quantity-input');

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
    ${groups.map((group, index) =>
      variantsGroupTemplate(
        () =>
          generateVariantsMatrix(
            Object.values(CategoryY).reduce(
              (result, v) => [...result, ...getInputVariants(v)] as any,
              []
            ) as any,
            ({ categoryY, options: { isDisabled, className } }) => html`
              <oryx-quantity-input
                data-selector=${getSelector(
                  categoryY as CategoryY,
                  isDisabled as boolean
                )}
                data-state=${className as string}
                data-disabled=${isDisabled as boolean}
                min=${group.options.min}
                max=${group.options.max}
                value=${group.options.value}
              ></oryx-quantity-input>
            `
          ),
        { title: group.title, addSeparator: index < groups.length - 1 }
      )
    )}
  `;
};
export const States = Template.bind({});

States.parameters = {
  chromatic: {
    delay: 2000,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};
