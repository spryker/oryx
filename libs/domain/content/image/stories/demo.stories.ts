import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { ContentImageContent, ContentImageOptions } from '../image.model';

export default {
  title: `${storybookPrefix}/Image`,
  args: {
    link: 'url',
    image:
      'https://raw.githubusercontent.com/spryker-shop/b2b-demo-shop/master/frontend/static/images/section-slider-item-image-10%402x.jpg',
    alt: 'banner image',
    fit: 'cover',
    position: 'center',
  } as ContentImageOptions & ContentImageContent,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<ContentImageOptions & ContentImageContent> = (
  props
): TemplateResult => {
  const { image, link } = props;
  const { fit, position } = props;
  return html`
    <oryx-content-image
      .content=${{ image, link }}
      .options=${{ fit, position }}
    ></oryx-content-image>
  `;
};

export const Demo = Template.bind({});
