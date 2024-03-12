import { wait } from '@spryker-oryx/utilities';
import { expect } from '@storybook/jest';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { RatingComponent, RatingProperties } from '../../index';

export default {
  title: `${storybookPrefix}/Graphical/Rating/Interactive`,
} as Meta;

const Template: Story<RatingProperties> = (): TemplateResult => {
  return html` <oryx-rating> lens quality </oryx-rating> `;
};

export const RatingInteractive = Template.bind({});

RatingInteractive.play = async (obj: {
  args: RatingProperties;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const component = obj.canvasElement.querySelector(
    'oryx-rating'
  ) as RatingComponent;

  const inputs = component.shadowRoot?.querySelectorAll('input') ?? [];

  await inputs[0].focus();
  await wait(500);
  await inputs[0].click();
  expect(component.value).toBe(1);

  await inputs[1].focus();
  await wait(500);
  await inputs[1].click();
  expect(component.value).toBe(2);

  await inputs[2].focus();
  await wait(500);
  await inputs[2].click();
  expect(component.value).toBe(3);

  await inputs[3].focus();
  await wait(500);
  await inputs[3].click();
  expect(component.value).toBe(4);

  await inputs[4].focus();
  await wait(500);
  await inputs[4].click();
  expect(component.value).toBe(5);

  await wait(500);
  await inputs[4].blur();
};
