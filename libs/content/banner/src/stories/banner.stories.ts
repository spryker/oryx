import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../constant';
import { BannerContent } from '../banner.model';
import '../index';

export default {
  title: `${storybookPrefix}/Banner`,
} as Meta;

const Template: Story<BannerContent> = (
  content: BannerContent
): TemplateResult => {
  return html` <oryx-banner .content=${content}></oryx-banner> `;
};

export const Banner = Template.bind({});
Banner.argTypes = {
  title: {
    control: { type: 'text' },
    defaultValue: 'Furniture - Upgrade Your Office',
  },
  subtitle: {
    control: { type: 'text' },
    defaultValue: '',
  },
  content: {
    control: { type: 'text' },
    defaultValue:
      'Keep your office up-to-date with the latest technology and accessories.',
  },
  link: {
    control: { type: 'text' },
    defaultValue: 'url',
  },
  image: {
    control: { type: 'text' },
    defaultValue:
      'https://www.us.sc-b2b.demo-spryker.com/assets/static/images/section-slider-item-image-10@2x.jpg',
  },
  urlTarget: {
    control: { type: 'text' },
    defaultValue: '_blank',
  },
  alt: {
    control: { type: 'text' },
    defaultValue: 'banner image',
  },
};
