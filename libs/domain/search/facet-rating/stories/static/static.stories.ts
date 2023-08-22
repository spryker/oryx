import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RouterService } from '@spryker-oryx/router';
import { FacetListService } from '@spryker-oryx/search';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Facet Rating`,
};

const Template: Story = (): TemplateResult => {
  resolve(FacetListService);

  const router = resolve(RouterService) as unknown as MockRouterService;
  router.params$.next({});

  return html`<oryx-search-facet-rating
      name="Rating"
      open
    ></oryx-search-facet-rating>

    <script>
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          const component = document.querySelector('oryx-search-facet-rating');
          if (!component) {
            return;
          }
          const observer = new MutationObserver((mutation) => {
            mutation.forEach((mutation) => {
              if (mutation) {
                const inputs = document
                  .querySelector('oryx-search-facet-rating')
                  .shadowRoot?.querySelector(
                    'oryx-search-facet-value-navigation'
                  )
                  .querySelectorAll('input');
                inputs[1]?.setAttribute('checked', '');
              }
            });
          });
          observer.observe(component, {
            childList: true,
            attributes: true,
            subtree: true,
          });
        },
        { once: true }
      );
    </script> `;
};

export const Static = Template.bind({});
