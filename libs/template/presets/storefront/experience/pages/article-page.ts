import { StaticComponent } from '@spryker-oryx/experience';

export const articlePage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Article Page',
    route: '/article/:id',
    description: 'Default Article Page Description',
  },
  options: {
    data: {
      rules: [{ layout: 'flex', padding: '30px 0' }],
    },
  },
  components: [
    {
      type: 'oryx-content-article',
      options: {
        data: {
          rules: [{ width: '80%', margin: 'auto' }],
        },
      },
    },
  ],
};
