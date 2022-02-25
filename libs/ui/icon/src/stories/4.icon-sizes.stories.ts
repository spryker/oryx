import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../constant';
import { IconProperties, IconTypes } from '../icon.model';
import '../index';

export default { title: `${storybookPrefix}/Icon` } as Meta;

interface Props extends IconProperties {
  customSize: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <style>
      oryx-icon {
        border: solid 1px var(--oryx-color-ink);
      }
    </style>
    <h1>Icon size by attribute</h1>
    <div class="icon-set">
      <oryx-icon .type=${props.type} size="large"></oryx-icon>
      <oryx-icon type=${props.type} size="medium"></oryx-icon>
      <oryx-icon type=${props.type} size="small"></oryx-icon>
    </div>

    <h1>Icon size by global custom properties</h1>
    <div class="icon-set" style="--oryx-icon-size: 156px">
      <oryx-icon type=${props.type}></oryx-icon>
      <oryx-icon type=${props.type}></oryx-icon>
      <oryx-icon type=${props.type}></oryx-icon>
    </div>

    <div class="icon-set" style="--oryx-icon-size:30px">
      ${Array.from(Array(24)).map(
        () => html`<oryx-icon type=${props.type}></oryx-icon>`
      )}
    </div>

    <h1>Icon size by local custom properties</h1>

    <div class="icon-set" style="--oryx-icon-size:20px">
      ${Array.from(Array(5)).map(
        (i, n) =>
          html`<oryx-icon
            type=${props.type}
            style=${`--oryx-icon-size:${(n + 1) * 10}px`}
          ></oryx-icon>`
      )}
    </div>

    <h1>Custom size</h1>

    <div class="icon-set" style="--oryx-icon-size:${props.customSize}">
      <oryx-icon type=${props.type}></oryx-icon>
    </div>

    <style>
      div.icon-set {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        width: 500px;
        padding-bottom: 10px;
      }
    </style>
  `;
};

export const IconSizes = Template.bind({});

IconSizes.argTypes = {
  type: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
    defaultValue: 'desktop',
  },
  customSize: {
    control: { type: 'text' },
    defaultValue: '50px',
  },
};
