import { resolve } from '@spryker-oryx/di';
import { BreadcrumbService } from '@spryker-oryx/site';
import { MockBreadcrumbService } from '@spryker-oryx/site/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

const breadcrumbs = [
  { text: { raw: 'Home' }, url: '/' },
  { text: { raw: 'Office Equipments' }, url: '/1' },
  { text: { raw: 'Electronic Devices' }, url: '/2' },
  {
    text: {
      raw: 'Computers, tablets, smartphones and other electronic devices and accessories',
    },
    url: '/3',
  },
  { text: { raw: 'Computers & Tablets' }, url: '/4' },
  { text: { raw: 'Tablets & iPads' }, url: '/5' },
  { text: { raw: 'iPads' }, url: '/6' },
  { text: { raw: 'iPad accessories' }, url: '/7' },
];

export default {
  title: `${storybookPrefix}/Breadcrumb/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  resolve<MockBreadcrumbService>(BreadcrumbService).set(breadcrumbs);
  return html`<oryx-site-breadcrumb></oryx-site-breadcrumb>`;
};

export const LongTrail = Template.bind({});
