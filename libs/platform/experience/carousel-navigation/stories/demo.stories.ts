import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import {
  ArrowNavigationBehavior,
  CarouselIndicatorAlignment,
  CarouselIndicatorPosition,
  CarouselLayoutProperties,
} from '../../src/services';
import { items } from './util';

export default {
  title: `${storybookPrefix}/Layout/Carousel/Navigation`,
  args: {
    showArrows: true,
    showIndicators: true,
    arrowNavigationBehavior: 'slide',
    indicatorsPosition: CarouselIndicatorPosition.Below,
    indicatorsAlignment: CarouselIndicatorAlignment.Center,
    scrollWithMouse: true,
    scrollWithTouch: true,
    scrollBehavior: 'smooth',
  } as CarouselLayoutProperties,
  argTypes: {
    arrowNavigationBehavior: {
      options: [ArrowNavigationBehavior.Slide, ArrowNavigationBehavior.Item],
      control: { type: 'select' },
    },
    scrollBehavior: {
      options: ['smooth', 'instant'],
      control: { type: 'select' },
    },
    indicatorsPosition: {
      options: [
        CarouselIndicatorPosition.Bottom,
        CarouselIndicatorPosition.Below,
      ],
      control: { type: 'select' },
    },
    indicatorsAlignment: {
      options: [
        CarouselIndicatorAlignment.Start,
        CarouselIndicatorAlignment.Center,
        CarouselIndicatorAlignment.End,
      ],
      control: { type: 'select' },
    },
  },
} as Meta;

const Template: Story<CarouselLayoutProperties> = (
  props: CarouselLayoutProperties
): TemplateResult => {
  const options = { rules: [{ layout: { type: 'carousel', ...props } }] };
  return html`
    <oryx-layout .options=${options}> ${items(5)} </oryx-layout>

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

export const Demo = Template.bind({});
