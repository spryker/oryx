import { StaticComponent } from '@spryker-oryx/experience';

export const HomePage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Home Page',
    route: '/',
    description: 'Home Page Description',
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
          rules: [{ layout: 'carousel', padding: '30 0' }],
          category: '10',
          sort: 'rating',
        },
      },
    },
  ],
};
