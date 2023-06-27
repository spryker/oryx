import { StaticComponent } from '@spryker-oryx/experience';

const brand = (name: string, rules?: any) => ({
  type: 'oryx-content-banner',
  name,
  content: { data: { graphic: name } },
  options: { data: { link: `/search?q=${name}`, rules } },
});

export const homePage: StaticComponent = {
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
          rules: [
            { layout: 'carousel', padding: '30px 0 5px', align: 'stretch' },
            { query: { breakpoint: 'sm' }, padding: '20px' },
          ],
          category: '10',
          sort: 'rating',
        },
      },
    },
    {
      type: 'oryx-composition',
      name: 'brands',
      options: {
        data: {
          rules: [
            {
              layout: 'grid',
              padding: '60px 0',
              gap: '30px 0px',
              columnCount: 6,
              justify: 'center',
              fill: 'var(--oryx-color-neutral-8)',
            },
            { query: { breakpoint: 'md' }, columnCount: 4 },
            { query: { breakpoint: 'sm' }, columnCount: 3 },
            {
              query: { childs: true },
              height: '50px',
              padding: '0px 40px',
              justify: 'center',
            },
            {
              query: { childs: true, hover: true },
              fill: 'initial',
              scale: 1.1,
            },
          ],
        },
      },
      components: [
        brand('samsung'),
        brand('sony'),
        brand('lenovo'),
        brand('hp'),
        brand('tomtom'),
        brand('dell'),
        brand('fujitsu', [{ padding: '0 0 2px' }]),
        brand('asus'),
        brand('acer'),
      ],
    },
  ],
};
