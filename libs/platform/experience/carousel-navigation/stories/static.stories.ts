import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import {
  ArrowNavigationBehavior,
  CarouselLayoutProperties,
} from '../../src/services';
import { items } from './util';

const demoTable = { category: 'demo' };

export default {
  title: `${storybookPrefix}/Layout/Carousel`,
} as Meta;

const options = (props: CarouselLayoutProperties) => ({
  rules: [
    {
      layout: {
        type: 'carousel',
        showArrows: true,
        showIndicators: true,
        scrollBehavior: 'smooth',
        scrollWithMouse: true,
        indicatorsAlignment: 'center',
        ...props,
      },
    },
  ],
});

const navigation = (
  title: string,
  props?: CarouselLayoutProperties,
  itemCount = 12
) => html`
  <h3>Carousel with ${title}</h3>
  <oryx-layout .options=${options(props ?? {})}>
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
    ]}
    ${[24, 12, 8, 7, 6, 5, 4, 3, 2, 1].map((count) => [
      navigation(`${count} Items`, {}, count),
    ])}

    <style>
      oryx-layout {
        margin-bottom: 50px;
      }
      oryx-layout > * {
        background: red;
        padding: 50px;
        text-align: center;
      }
    </style>
  `;
};

export const Static = Template.bind({});
