import { StaticComponent } from '@spryker-oryx/experience';

const brand = (name: string, rules?: any) => ({
  type: 'oryx-content-image',
  name,
  content: { data: { graphic: name, link: `/search?q=${name}` } },
  options: { data: { rules } },
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
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-content-image',
          name: 'hero',
          content: {
            data: {
              link: `/category/12`,
              alt: 'hero image',
              image:
                'https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
            },
          },
          options: {
            data: {
              position: 'center 20%',
              rules: [
                {
                  width: '100%',
                  style: 'position:absolute;left:0;z-index:-1',
                },
              ],
            },
          },
        },
        {
          type: 'oryx-content-text',
          content: {
            data: {
              text: `
            <span class="subtitle">CANON EOS R7 System camera</span>
            <h1 style="margin:20px 0;">Discover everything</h1>
            <h3 style="margin-bottom:20px">EOS R7 wows with its ability to track fast-moving subjects with its Deep-learning Dual Pixel CMOS AF II focus system.</h3>
            <oryx-button><a href="/category/12">Shop now</a></oryx-button>
          `,
            },
          },
          options: {
            data: {
              rules: [
                {
                  padding: '40px',
                  background: 'rgba(35, 35, 35, 0.56);',
                  margin: '30px 0',
                  radius: 4,
                  style: 'color: white;gap:20px',
                },
              ],
            },
          },
        },
      ],
      options: {
        data: {
          rules: [
            {
              height: '550px',
              layout: 'split',
              align: 'end',
              bleed: true,
            },
          ],
        },
      },
    },
    {
      type: 'oryx-product-list',
      options: {
        data: {
          rules: [
            {
              layout: 'carousel',
              padding: '30px 0 5px',
              align: 'stretch',
            },
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
