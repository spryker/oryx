import { contactPage as storefrontContactPage } from '@spryker-oryx/presets/storefront';
import { IconTypes } from '@spryker-oryx/ui/icon';

storefrontContactPage.components = [
  {
    type: 'oryx-content-link',
    content: {
      data: {
        text: 'This is B2B Contact Page element. Remove me when the page is implemented',
      },
    },
    options: {
      type: 'rawUrl',
      url: '/contact',
      icon: IconTypes.Check,
    },
  },
];

export const contactPage = storefrontContactPage;
