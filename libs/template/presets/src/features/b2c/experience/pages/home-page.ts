import { StaticComponent } from '@spryker-oryx/experience';

export const HomePage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Home Page', route: '/' },
  components: [
    {
      type: 'oryx-content-video',
      options: {
        data: {
          src: 'https://dms.licdn.com/playlist/D4E05AQHKwD2mLTM4Og/mp4-720p-30fp-crf28/0/1677583837226?e=1678287600&v=beta&t=YCFw7j-GCjAJEh9GfrTdLloXbbYrkRkTSU866PNVFlE',
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
