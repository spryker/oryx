import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constants';
import { demoStyles, elements } from './utils';

const table = { category: 'first' };
export default {
  title: `${storybookPrefix}/Composition/Layout`,
  parameters: {
    chromatic: { delay: 1000 },
  },
  args: {
    columnCount: 4,
    layout: 'grid',
    gap: '10px',
    elementHeight: '50px',
    span: 1,
    padding: '0px',
    margin: '0px',
    border: '',
    elementWidth: '50%',
  },
  argTypes: {
    layout: {
      options: ['grid', 'carousel', 'column'],
      control: { type: 'radio' },
    },
    span: { table },
    padding: { table },
    margin: { table },
    border: { table },
    elementWidth: { table },
  },
} as Meta;

interface Props {
  columnCount: number;
  layout: string;
  gap: string;
  elementHeight: string;
  elementWidth: string;
  span: number;
  padding: string;
  margin: string;
  border: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <experience-composition
      class="layout-${props.layout}"
      style="--oryx-layout-item-count:${props.columnCount}"
    >
      ${elements()}
    </experience-composition>

    ${demoStyles}

    <style>
      experience-composition {
        --oryx-layout-gap: ${props.gap};
      }

      experience-composition > div {
        --oryx-layout-height: ${props.elementHeight};
      }

      experience-composition > div:nth-child(2) {
        --oryx-layout-span: ${props.span};
        --oryx-layout-padding: ${props.padding || '0px'};
        --oryx-layout-margin: ${props.margin === '0' ? '0px' : props.margin};
        flex: 0 0 ${props.elementWidth};
        border: ${props.border};
      }

      experience-composition > div:nth-child(2) .content {
        background-color: var(--oryx-color-primary-300);
      }
    </style>
  `;
};

export const DemoLayout = Template.bind({});
