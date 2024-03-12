import { wait } from '@spryker-oryx/utilities';
import { expect } from '@storybook/jest';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { PaginationComponent } from '../../pagination.component';
import { PaginationProperties } from '../../pagination.model';

export default {
  title: `${storybookPrefix}/Navigations/Pagination/Interactive`,
} as Meta;

const Template: Story<PaginationProperties> = (): TemplateResult => {
  return html`<oryx-pagination enableNavigation>
    ${Array.from(new Array(10).keys()).map((key) => {
      return html`<a tabindex="0">${key + 1}</a>`;
    })}
  </oryx-pagination> `;
};

export const PaginationInteractive = Template.bind({});

PaginationInteractive.play = async (obj: {
  args: PaginationProperties;
  canvasElement: HTMLElement;
}): Promise<void> => {
  await customElements.whenDefined('oryx-pagination');

  const component = obj.canvasElement.querySelector(
    'oryx-pagination'
  ) as PaginationComponent;

  component.requestUpdate();
  await component.updateComplete;

  const nextPageArrow = component.shadowRoot?.querySelector(
    `a:last-of-type`
  ) as HTMLAnchorElement;
  nextPageArrow.addEventListener('click', (e) => {
    e.preventDefault();
    component.current++;
  });
  const firstPageLink = component.querySelector(
    'a:first-child'
  ) as HTMLAnchorElement;
  firstPageLink.addEventListener('click', (e) => {
    e.preventDefault();
    component.current = Number(firstPageLink.textContent);
  });

  for (let i = 1; i < 10; i++) {
    await nextPageArrow.focus();
    await wait(500);
    await nextPageArrow.click();
    expect(component.current).toBe(i + 1);
  }

  await firstPageLink.focus();
  await wait(500);
  await firstPageLink.click();
  expect(component.current).toBe(1);
};
