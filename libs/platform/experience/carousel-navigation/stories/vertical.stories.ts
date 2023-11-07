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
    layout-vertical
  >
    ${items(itemCount)}
  </oryx-layout>
`;

const Template: Story<CarouselLayoutProperties> = (): TemplateResult => {
  return html`
    ${[navigation('default navigation')]}
    ${navigation('scroll behavior per item', {
      arrowNavigationBehavior: ArrowNavigationBehavior.Item,
    })}

    <style>
      oryx-layout {
        width: 400px;
        margin-bottom: 50px;
        max-height: 500px;
        row-gap: 25px;
      }
      oryx-layout > * {
        background: var(--oryx-color-neutral-5);
        height: 50px;
        padding: 50px;
        text-align: center;
      }

      oryx-layout[layout-vertical] > * {
        box-sizing: content-box;
      }
    </style>
  `;
};

export const Vertical = Template.bind({});
