import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ButtonColor } from '../button.model';
import { staticButtons } from './util';

export default {
  title: `${storybookPrefix}/Actions/Action/Static`,
} as Meta;

const PrimaryTemplate: Story = (): TemplateResult => {
  return staticButtons(ButtonColor.Primary);
};

const SecondaryTemplate: Story = (): TemplateResult => {
  return staticButtons(ButtonColor.Secondary);
};

const NeutralTemplate: Story = (): TemplateResult => {
  return staticButtons(ButtonColor.Neutral);
};

const HighlightTemplate: Story = (): TemplateResult => {
  return staticButtons(ButtonColor.Highlight);
};

const SuccessTemplate: Story = (): TemplateResult => {
  return staticButtons(ButtonColor.Success);
};

const InfoTemplate: Story = (): TemplateResult => {
  return staticButtons(ButtonColor.Info);
};

const WarningTemplate: Story = (): TemplateResult => {
  return staticButtons(ButtonColor.Warning);
};

const ErrorTemplate: Story = (): TemplateResult => {
  return staticButtons(ButtonColor.Error);
};

export const Primary = PrimaryTemplate.bind({});
export const Secondary = SecondaryTemplate.bind({});
export const Neutral = NeutralTemplate.bind({});
export const Highlight = HighlightTemplate.bind({});
export const Success = SuccessTemplate.bind({});
export const Info = InfoTemplate.bind({});
export const Warning = WarningTemplate.bind({});
export const Error = ErrorTemplate.bind({});
