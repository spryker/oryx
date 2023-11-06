import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import {
  ArrowNavigationBehavior,
  CarouselLayoutProperties,
} from '../../src/services';
import { items } from './util';

export default {
  title: `${storybookPrefix}/Layout/Carousel/Navigation`,
} as Meta;

const navigation = (
  title: string,
  props?: CarouselLayoutProperties,
  style?: string,
  itemCount = 12
) => html`
  <h3>Carousel with ${title}</h3>
  <oryx-layout
    .options=${{ rules: [{ layout: { type: 'carousel', ...(props ?? {}) } }] }}
    .style=${style}
  >
    ${items(itemCount)}
  </oryx-layout>
`;

const Template: Story<CarouselLayoutProperties> = (): TemplateResult => {
  return html`
    ${[
      navigation('default navigation'),
      navigation('scroll behavior per item', {
        arrowNavigationBehavior: ArrowNavigationBehavior.Item,
      }),
      navigation('arrows', { showIndicators: false }),
      navigation('indicators', { showArrows: false }),
      navigation('more padding', {}, '--column-gap: 50px'),
      ...[24, 12, 8, 7, 6, 5, 4, 3, 2, 1].map((count) => [
        navigation(`${count} Items`, {}, undefined, count),
      ]),
    ]}

    <style>
      oryx-layout {
        margin-bottom: 50px;
      }
      oryx-layout > * {
        background: var(--oryx-color-neutral-5);
        padding: 50px;
        text-align: center;
      }
    </style>
  `;
};

export const Static = Template.bind({});
