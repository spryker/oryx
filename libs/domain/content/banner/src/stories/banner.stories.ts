import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { BannerContent, BannerOptions } from '../banner.model';

export default {
  title: `${storybookPrefix}/Banner`,
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

const Template: Story<BannerOptions & BannerContent> = (
  props
): TemplateResult => {
  const content = {
    title: props.title,
    subtitle: props.subtitle,
    content: props.content,
    image: props.image,
  };
  const options = {
    link: props.link,
    urlTarget: props.urlTarget,
    alt: props.alt,
  };
  return html`
    <oryx-content-banner
      .content=${content}
      .options=${options}
    ></oryx-content-banner>
  `;
};

export const Banner = Template.bind({});
Banner.args = {
  link: 'url',
  alt: 'banner image',
  title: 'Furniture - Upgrade Your Office',
  subtitle: '',
  content:
    'Keep your office up-to-date with the latest technology and accessories.',
  image:
    'https://raw.githubusercontent.com/spryker-shop/b2b-demo-shop/master/frontend/static/images/section-slider-item-image-10%402x.jpg',
};
