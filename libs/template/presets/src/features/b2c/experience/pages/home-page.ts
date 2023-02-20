import { StaticComponent } from '@spryker-oryx/experience';

export const HomePage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Home Page', route: '/' },
  components: [
    {
      type: 'oryx-content-video',
      options: {
        data: {
          src: 'https://d3g7htsbjjywiv.cloudfront.net/assets/common/images/media-page/redesigned-footage/footage-sizzle.webm',
          rules: [{ height: '35vh' }],
        },
      },
    },
    {
      type: 'oryx-product-list',
      options: {
        data: {
          rules: [
            {
              container: true,
              layout: 'carousel',
              padding: '30px 0',
              gap: '20',
            },
          ],
          category: '10',
          sort: 'rating',
        },
      },
    },
  ],
};
