import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import '../index';
import { m, xl, xs } from './images';

interface ImagesProps {
  minWidth: number;
}

export default { title: `${storybookPrefix}/Graphical/Image` } as Meta;

const Template: Story<ImagesProps> = (props: ImagesProps): TemplateResult => {
  return html`
    <style>
      oryx-image {
        --image-max-width: 200px;
        --image-max-height: 200px;
      }
    </style>

    <p>
      small: < ${props.minWidth / 2}px, medium: >= ${props.minWidth / 2}px and <
      ${props.minWidth}px, large: >= ${props.minWidth}px
    </p>

    <oryx-image>
      <source media="(min-width: ${props.minWidth}px)" srcset=${xl} />
      <source media="(min-width: ${props.minWidth / 2}px)" srcset=${m} />
      <img src=${xs} alt="preview" />
    </oryx-image>
  `;
};

export const ImageDemo = Template.bind({});

ImageDemo.parameters = {
  chromatic: { disableSnapshot: true },
};

ImageDemo.args = {
  minWidth: 1200,
};

ImageDemo.argTypes = {
  minWidth: {
    options: [600, 800, 1200],
    control: { type: 'radio' },
  },
};
