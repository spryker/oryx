import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';
import { TemplateProps, getTemplate } from '../common';
import { playStory } from './common';

export default {
  title: `${storybookPrefix}/Navigations/Page navigation/Interactive/Sync on scroll`,
} as Meta;

const templateProps: TemplateProps = {
  sectionsCount: 5,
  sectionHeight: 2000,
  viewportHeight: 300,
};

const Template: Story<undefined> = (): TemplateResult => {
  return getTemplate(templateProps);
};

export const SectionIsBiggerThanViewport = Template.bind({});

SectionIsBiggerThanViewport.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  return playStory(obj.canvasElement, templateProps);
};
