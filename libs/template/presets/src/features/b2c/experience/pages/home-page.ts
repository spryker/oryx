import { StaticComponent } from '@spryker-oryx/experience';

export const HomePage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'New Home Page',
    route: '/',
    description: 'Home Page Description',
    follow: false,
    index: true,
    'og:meta': 'our description',
  },
  components: [
    {
      type: 'oryx-content-video',
      options: {
        data: {
          src: 'https://www.youtube.com/watch?v=m6pG6fubp9g&t=5s',
          autoplay: true,
          muted: true,
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
