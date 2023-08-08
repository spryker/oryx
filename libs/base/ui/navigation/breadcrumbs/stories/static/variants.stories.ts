import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';
import { Breadcrumb } from '../../breadcrumbs.model';

const _home = {
  label: 'Home',
  url: '/',
};

const _bread1 = {
  label: 'Cameras & Camcorders',
  url: '/',
};

const _bread2 = {
  label: 'Digital Cameras',
  url: '/',
};

const _long = {
  label: 'Bose Quiet Comfort Bose Quiet Comfort Comfort S2202 S2202 S2202',
  url: '/',
};

const renderBreadcrumbs = (breadcrumbs: Breadcrumb[]): TemplateResult => {
  return html`
    <oryx-breadcrumbs>
      ${breadcrumbs.map(({ label, url }, index) => {
        return html`
          <a href=${ifDefined(url)}>${label}</a>
          ${when(
            index + 1 < breadcrumbs.length,
            () => html`<oryx-icon .type=${IconTypes.Front}></oryx-icon>`
          )}
        `;
      })}
    </oryx-breadcrumbs>
  `;
};

export default {
  title: `${storybookPrefix}/Navigations/Breadcrumbs/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Default</h3>
    ${renderBreadcrumbs([_home, _bread1, _bread2])}

    <h3>Long breadcrumb in the middle</h3>
    ${renderBreadcrumbs([_home, _long, _bread2])}

    <h3>Long breadcrumb in the end</h3>
    ${renderBreadcrumbs([_home, _bread1, _long])}

    <h3>Long list</h3>
    ${renderBreadcrumbs([
      _home,
      _bread1,
      _long,
      _bread2,
      _bread1,
      _bread2,
      _long,
      _bread1,
    ])}
  `;
};

export const Variants = Template.bind({});
