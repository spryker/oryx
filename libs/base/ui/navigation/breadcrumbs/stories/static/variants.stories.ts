import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';

interface Breadcrumb {
  text: string;
  url?: string;
  icon?: IconTypes;
}

const _home = {
  text: 'Home',
  url: '/',
};

const _homeIcon = {
  text: 'Home',
  url: '/',
  icon: IconTypes.Rocket,
};

const _bread1 = {
  text: 'Cameras & Camcorders',
  url: '/',
};

const _bread2 = {
  text: 'Digital Cameras',
  url: '/',
};

const _long = {
  text: 'Bose Quiet Comfort Bose Quiet Comfort Comfort S2202 S2202 S2202',
  url: '/',
};

const _text = {
  text: 'Just a text',
};

const renderBreadcrumbs = (
  breadcrumbs: Breadcrumb[],
  customDivider = false
): TemplateResult => {
  return html`
    <oryx-breadcrumbs>
      ${breadcrumbs.map(({ text, url, icon }, index) => {
        return html`
          ${when(
            url,
            () =>
              html`<a href=${ifDefined(url)}
                >${icon ? html`<oryx-icon .type=${icon}></oryx-icon>` : text}</a
              >`,
            () => html`<span>${text}</span>`
          )}
          ${when(index + 1 < breadcrumbs.length, () =>
            !customDivider
              ? html`<oryx-icon .type=${IconTypes.Front}></oryx-icon>`
              : html`@@@`
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

    <h3>Custom divider</h3>
    ${renderBreadcrumbs([_home, _bread1, _bread2], true)}

    <h3>Iconed link</h3>
    ${renderBreadcrumbs([_homeIcon, _bread1, _bread2])}

    <h3>Last breadcrumb just a text</h3>
    ${renderBreadcrumbs([_home, _bread1, _text])}

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
