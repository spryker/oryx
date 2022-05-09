import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.storybook/constant';
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
Banner.args = {
  title: 'Furniture - Upgrade Your Office',
  subtitle: '',
  content:
    'Keep your office up-to-date with the latest technology and accessories.',
  link: 'url',
  image:
    'https://www.us.sc-b2b.demo-spryker.com/assets/static/images/section-slider-item-image-10@2x.jpg',
  alt: 'banner image',
};
