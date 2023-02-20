import { Component } from '@spryker-oryx/experience';

export const HomePage: Component<any> = {
  type: 'Page',
  meta: {
    title: 'Home Page',
    route: '/',
  },
  components: [
    {
      type: 'oryx-content-video',
      name: 'Video',
      options: {
        data: {
          src: 'https://d3g7htsbjjywiv.cloudfront.net/assets/common/images/media-page/redesigned-footage/footage-sizzle.webm',
          rules: [
            {
              height: '35vh',
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
    {
      type: 'auth-logout',
      name: 'User Logout',
      options: {
        data: {
          customRedirect: 'contact',
        },
      },
    },
    {
      type: 'experience-composition',
      components: [
        {
          type: 'oryx-content-banner',
          name: 'Image banner',
          options: {
            data: {
              alt: 'Banner 1',
            },
          },
          content: {
            data: {
              title: 'Banner',
              image:
                'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXN8ZW58MHx8MHx8&w=1000&q=80',
            },
          },
        },
        {
          type: 'experience-composition',
          name: 'Composition2',
          components: [
            {
              type: 'oryx-content-banner',
              name: 'Image banner',
              options: {
                data: {
                  alt: 'Banner 2',
                },
              },
              content: {
                data: {
                  title: 'Banner',
                  image:
                    'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXN8ZW58MHx8MHx8&w=1000&q=80',
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'oryx-content-link',
      name: 'Content Link',
      options: {
        data: {
          target: '_self',
          type: 'category',
          text: 'About Product',
          id: 'about',
        },
      },
      content: {},
    },
    {
      type: 'oryx-content-link',
      name: 'Content Link 2',
      options: {
        data: {
          target: '_self',
          type: 'page',
          text: 'About Product 123',
          id: 'about2',
          icon: 'rocket',
        },
      },
      content: {},
    },
    {
      type: 'oryx-content-banner',
      name: 'Test Oryx Banner',
      options: {
        data: {
          alt: 'Banner 3',
        },
      },
      content: {
        data: {
          title: 'The heading',
          image:
            'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXN8ZW58MHx8MHx8&w=1000&q=80',
          content: 'adsfa asdf asdf asdf as f asd fads f asdfadsf ads fadsf',
        },
      },
    },
    {
      type: 'oryx-content-banner',
      options: {
        data: {
          link: 'https://spryker.com',
          linkLabel: 'Spryker',
          urlTarget: '_blank',
          alt: 'Banner 4',
        },
      },
      content: {
        data: {
          title: 'Furniture - Upgrade Your Office',
          content:
            'Keep your office up-to-date with the latest technology and accessories.',
          image:
            'https://www.us.sc-b2b.demo-spryker.com/assets/static/images/section-slider-item-image-10@2x.jpg',
        },
      },
    },
    {
      type: 'oryx-content-banner',
      options: {
        data: {
          alt: 'Banner 5',
        },
      },
      content: {
        data: {
          title: 'Mock Dynamic component render',
          subtitle: 'some other banner',
          content:
            'Banner description. Not displayed in the demo, but exists for demo purposes. Please ask UI team to put me in the right place in the banner.',
          image:
            'https://res.cloudinary.com/drrusglvs/image/upload/v1641985933/b7bhmsvqduyczsbhiiwx.gif',
        },
      },
    },
    {
      type: 'search-box',
      name: 'SearchBox',
      options: {
        data: {
          minChars: 2,
          completionsCount: 5,
          productsCount: 6,
          categoriesCount: 5,
          cmsCount: 5,
        },
      },
    },
  ],
};
