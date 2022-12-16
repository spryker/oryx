export const mockRes = {
  data: [
    {
      type: 'catalog-search',
      id: null,
      attributes: {
        spellingSuggestion: null,
        sort: {
          sortParamNames: [
            'rating',
            'name_asc',
            'name_desc',
            'price_asc',
            'price_desc',
            'popularity',
          ],
          sortParamLocalizedNames: {
            rating: 'Sort by product ratings',
            name_asc: 'Sort by name ascending',
            name_desc: 'Sort by name descending',
            price_asc: 'Sort by price ascending',
            price_desc: 'Sort by price descending',
            popularity: 'Sort by popularity',
          },
          currentSortParam: null,
          currentSortOrder: null,
        },
        pagination: {
          numFound: 218,
          currentPage: 1,
          maxPage: 19,
          currentItemsPerPage: 12,
          config: {
            parameterName: 'page',
            itemsPerPageParameterName: 'ipp',
            defaultItemsPerPage: 12,
            validItemsPerPageOptions: [12, 24, 36],
          },
        },
        abstractProducts: [
          {
            abstractSku: '115',
            price: 7000,
            abstractName: 'DELL OptiPlex 3020',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 7000,
                DEFAULT: 7000,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/norm/medium/27295368-2600.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/norm/high/27295368-2600.jpg',
              },
            ],
          },
          {
            abstractSku: '119',
            price: 9999,
            abstractName: 'Fujitsu ESPRIMO E920',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 9999,
                DEFAULT: 9999,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_mediums/29804808_8209.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/gallery_raw/29804808_8209.jpeg',
              },
            ],
          },
          {
            abstractSku: '120',
            price: 345699,
            abstractName: 'Fujitsu ESPRIMO P556',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 345699,
                DEFAULT: 345699,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_mediums/29890350_9814.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/gallery/29890350_9814.jpg',
              },
            ],
          },
          {
            abstractSku: '121',
            price: 10680,
            abstractName: 'HP 200 280 G1',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 10680,
                DEFAULT: 10680,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_mediums/img_29406823_medium_1480596185_822_26035.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/gallery_raw/29406823_8847.png',
              },
            ],
          },
          {
            abstractSku: '124',
            price: 2800,
            abstractName: 'HP ProDesk 400 G3',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 2800,
                DEFAULT: 2800,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_mediums/30400157_1167.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/gallery/30400157_1167.jpg',
              },
            ],
          },
          {
            abstractSku: '125',
            price: 29747,
            abstractName: 'HP ProDesk 600 G2',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 29747,
                DEFAULT: 29747,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_mediums/img_30703764_medium_1484128349_2482_19331.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/gallery/30703764_3276.jpg',
              },
            ],
          },
          {
            abstractSku: '127',
            price: 9080,
            abstractName: 'HP Z 620',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 9080,
                DEFAULT: 9080,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_mediums/img_22828284_medium_1483352627_419_25017.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/norm/high/22828284-8540.jpg',
              },
            ],
          },
          {
            abstractSku: '129',
            price: 30784,
            abstractName: 'Lenovo ThinkCenter E73',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 30784,
                DEFAULT: 30784,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_mediums/29554217_7377.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/gallery/29554217_7377.jpg',
              },
            ],
          },
          {
            abstractSku: '130',
            price: 22054,
            abstractName: 'Lenovo ThinkStation P300',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 22054,
                DEFAULT: 22054,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_mediums/29285281_8883.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/gallery/29285281_8883.jpg',
              },
            ],
          },
          {
            abstractSku: '131',
            price: 7365,
            abstractName: 'Lenovo ThinkStation P900',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 7365,
                DEFAULT: 7365,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/norm/medium/24872891-7070.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/norm/high/24872891-7070.jpg',
              },
            ],
          },
          {
            abstractSku: '167',
            price: 16647,
            abstractName: 'HP Elite x2 1012 G1',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 16647,
                DEFAULT: 16647,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_lows/33503724_0284972858.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/gallery_mediums/33503724_0284972858.jpg',
              },
            ],
          },
          {
            abstractSku: '168',
            price: 13643,
            abstractName: 'HP ElitePad 1000 G2',
            prices: [
              {
                priceTypeName: 'DEFAULT',
                currency: {
                  code: 'EUR',
                  symbol: '€',
                  name: 'Euro',
                },
                grossAmount: 13643,
                DEFAULT: 13643,
              },
            ],
            images: [
              {
                externalUrlSmall:
                  'https://images.icecat.biz/img/gallery_lows/img_29379693_low_1494980299_4984_4722.jpg',
                externalUrlLarge:
                  'https://images.icecat.biz/img/gallery_raw/img_29379693_raw_1494980295_4192_4722.jpg',
              },
            ],
          },
        ],
        valueFacets: [
          {
            name: 'category',
            localizedName: 'Categories',
            docCount: null,
            values: [
              {
                value: 1,
                doc_count: 218,
              },
              {
                value: 5,
                doc_count: 72,
              },
              {
                value: 2,
                doc_count: 63,
              },
              {
                value: 14,
                doc_count: 51,
              },
              {
                value: 4,
                doc_count: 41,
              },
              {
                value: 11,
                doc_count: 39,
              },
              {
                value: 12,
                doc_count: 38,
              },
              {
                value: 9,
                doc_count: 30,
              },
              {
                value: 10,
                doc_count: 30,
              },
              {
                value: 8,
                doc_count: 28,
              },
              {
                value: 6,
                doc_count: 24,
              },
              {
                value: 3,
                doc_count: 22,
              },
              {
                value: 7,
                doc_count: 20,
              },
              {
                value: 13,
                doc_count: 5,
              },
              {
                value: 15,
                doc_count: 5,
              },
              {
                value: 16,
                doc_count: 2,
              },
              {
                value: 18,
                doc_count: 1,
              },
              {
                value: 19,
                doc_count: 1,
              },
            ],
            activeValue: null,
            config: {
              parameterName: 'category',
              isMultiValued: false,
            },
          },
          {
            name: 'label',
            localizedName: 'Product Labels',
            docCount: null,
            values: [
              {
                value: 'SALE %',
                doc_count: 64,
              },
              {
                value: 'New',
                doc_count: 4,
              },
              {
                value: 'Alternatives available',
                doc_count: 1,
              },
              {
                value: 'Discontinued',
                doc_count: 1,
              },
            ],
            activeValue: null,
            config: {
              parameterName: 'label',
              isMultiValued: true,
            },
          },
          {
            name: 'color',
            localizedName: 'Color',
            docCount: null,
            values: [
              {
                value: 'Black',
                doc_count: 78,
              },
              {
                value: 'White',
                doc_count: 38,
              },
              {
                value: 'Silver',
                doc_count: 20,
              },
              {
                value: 'Blue',
                doc_count: 10,
              },
              {
                value: 'Grey',
                doc_count: 8,
              },
              {
                value: 'Red',
                doc_count: 8,
              },
              {
                value: 'Pink',
                doc_count: 7,
              },
              {
                value: 'Gold',
                doc_count: 6,
              },
              {
                value: 'Green',
                doc_count: 2,
              },
              {
                value: 'Orange',
                doc_count: 2,
              },
            ],
            activeValue: null,
            config: {
              parameterName: 'color',
              isMultiValued: true,
            },
          },
          {
            name: 'storage_capacity',
            localizedName: 'Storage Capacity',
            docCount: null,
            values: [
              {
                value: '32 GB',
                doc_count: 5,
              },
              {
                value: '128 GB',
                doc_count: 3,
              },
              {
                value: '64 GB',
                doc_count: 3,
              },
              {
                value: '16 GB',
                doc_count: 2,
              },
              {
                value: '8 GB',
                doc_count: 1,
              },
            ],
            activeValue: null,
            config: {
              parameterName: 'storage_capacity',
              isMultiValued: true,
            },
          },
          {
            name: 'brand',
            localizedName: 'Brand',
            docCount: null,
            values: [
              {
                value: 'Samsung',
                doc_count: 46,
              },
              {
                value: 'Sony',
                doc_count: 42,
              },
              {
                value: 'Canon',
                doc_count: 29,
              },
              {
                value: 'Acer',
                doc_count: 19,
              },
              {
                value: 'Asus',
                doc_count: 16,
              },
              {
                value: 'HP',
                doc_count: 15,
              },
              {
                value: 'Lenovo',
                doc_count: 11,
              },
              {
                value: 'TomTom',
                doc_count: 10,
              },
              {
                value: 'Fujitsu',
                doc_count: 6,
              },
              {
                value: 'ASUS',
                doc_count: 4,
              },
            ],
            activeValue: null,
            config: {
              parameterName: 'brand',
              isMultiValued: false,
            },
          },
          {
            name: 'touchscreen',
            localizedName: 'Touchscreen',
            docCount: null,
            values: [
              {
                value: 'Yes',
                doc_count: 5,
              },
              {
                value: 'No',
                doc_count: 3,
              },
            ],
            activeValue: null,
            config: {
              parameterName: 'touchscreen',
              isMultiValued: false,
            },
          },
          {
            name: 'weight',
            localizedName: 'Weight',
            docCount: null,
            values: [
              {
                value: '132 g',
                doc_count: 7,
              },
              {
                value: '18 g',
                doc_count: 4,
              },
              {
                value: '45 g',
                doc_count: 4,
              },
              {
                value: '118 g',
                doc_count: 3,
              },
              {
                value: '152 g',
                doc_count: 3,
              },
              {
                value: '141 g',
                doc_count: 2,
              },
              {
                value: '155g',
                doc_count: 2,
              },
              {
                value: '168 g',
                doc_count: 2,
              },
              {
                value: '22.39 oz',
                doc_count: 2,
              },
              {
                value: '389 g',
                doc_count: 2,
              },
            ],
            activeValue: null,
            config: {
              parameterName: 'weight',
              isMultiValued: true,
            },
          },
          {
            name: 'merchant_name',
            localizedName: 'Merchant',
            docCount: null,
            values: [
              {
                value: 'Spryker',
                doc_count: 109,
              },
              {
                value: 'Video King',
                doc_count: 65,
              },
              {
                value: 'Budget Cameras',
                doc_count: 41,
              },
              {
                value: 'Sony Experts',
                doc_count: 25,
              },
            ],
            activeValue: null,
            config: {
              parameterName: 'merchant_name',
              isMultiValued: true,
            },
          },
        ],
        rangeFacets: [
          {
            name: 'price-DEFAULT-EUR-GROSS_MODE',
            localizedName: 'Price range',
            min: 175,
            max: 345699,
            activeMin: 175,
            activeMax: 345699,
            docCount: null,
            config: {
              parameterName: 'price',
              isMultiValued: false,
            },
          },
          {
            name: 'rating',
            localizedName: 'Product Ratings',
            min: 4,
            max: 5,
            activeMin: 4,
            activeMax: 5,
            docCount: null,
            config: {
              parameterName: 'rating',
              isMultiValued: false,
            },
          },
        ],
        categoryTreeFilter: [
          {
            nodeId: 5,
            name: 'Computer',
            docCount: 72,
            children: [
              {
                nodeId: 6,
                name: 'Notebooks',
                docCount: 24,
                children: [],
              },
              {
                nodeId: 7,
                name: "Pc's/Workstations",
                docCount: 20,
                children: [],
              },
              {
                nodeId: 8,
                name: 'Tablets',
                docCount: 28,
                children: [],
              },
            ],
          },
          {
            nodeId: 2,
            name: 'Cameras & Camcorders',
            docCount: 63,
            children: [
              {
                nodeId: 4,
                name: 'Digital Cameras',
                docCount: 41,
                children: [],
              },
              {
                nodeId: 3,
                name: 'Camcorders',
                docCount: 22,
                children: [],
              },
            ],
          },
          {
            nodeId: 16,
            name: 'Food',
            docCount: 2,
            children: [
              {
                nodeId: 18,
                name: 'Fish',
                docCount: 1,
                children: [],
              },
              {
                nodeId: 19,
                name: 'Vegetables',
                docCount: 1,
                children: [],
              },
            ],
          },
          {
            nodeId: 11,
            name: 'Telecom & Navigation',
            docCount: 39,
            children: [
              {
                nodeId: 12,
                name: 'Smartphones',
                docCount: 38,
                children: [],
              },
            ],
          },
          {
            nodeId: 15,
            name: 'Cables',
            docCount: 5,
            children: [],
          },
          {
            nodeId: 9,
            name: 'Smart Wearables',
            docCount: 30,
            children: [
              {
                nodeId: 10,
                name: 'Smartwatches',
                docCount: 30,
                children: [],
              },
            ],
          },
        ],
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?include=abstract-products,concrete-products',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '115',
            },
            {
              type: 'abstract-products',
              id: '119',
            },
            {
              type: 'abstract-products',
              id: '120',
            },
            {
              type: 'abstract-products',
              id: '121',
            },
            {
              type: 'abstract-products',
              id: '124',
            },
            {
              type: 'abstract-products',
              id: '125',
            },
            {
              type: 'abstract-products',
              id: '127',
            },
            {
              type: 'abstract-products',
              id: '129',
            },
            {
              type: 'abstract-products',
              id: '130',
            },
            {
              type: 'abstract-products',
              id: '131',
            },
            {
              type: 'abstract-products',
              id: '167',
            },
            {
              type: 'abstract-products',
              id: '168',
            },
          ],
        },
      },
    },
  ],
  links: {
    self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?include=abstract-products,concrete-products',
    last: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?include=abstract-products,concrete-products&page[offset]=216&page[limit]=12',
    first:
      'http://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?include=abstract-products,concrete-products&page[offset]=0&page[limit]=12',
    next: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?include=abstract-products,concrete-products&page[offset]=12&page[limit]=12',
  },
  included: [
    {
      type: 'concrete-products',
      id: '115_27295368',
      attributes: {
        sku: '115_27295368',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '115',
        name: 'DELL OptiPlex 3020',
        description:
          'Great performance. Outstanding value Get the job done with business-ready desktops offering superb value with strong performance, exceptional security and easy serviceability. Stop advanced threats and zero-day attacks with Dell Data Protection | Protected Workspace — a proactive, real-time solution for malware protection. Ensure authorized access through multifactor, single sign-on (SSO) and preboot authentication with Dell Data Protection | Security Tools. Streamline administration with integration into Dell KACE appliances, Microsoft System Center and industry-standard tools. Deploy with flexibility through multiple chassis options. Select the small form factor chassis, optimized for constrained workspaces, or the expandable mini tower with support for up to four PCIe cards.',
        attributes: {
          processor_cache: '3 MB',
          bus_type: 'DMI',
          processor_threads: '2',
          tcase: '72 °',
          brand: 'DELL',
          processor_frequency: '3.2 GHz',
        },
        superAttributesDefinition: ['processor_cache', 'processor_frequency'],
        metaTitle: 'DELL OptiPlex 3020',
        metaKeywords: 'DELL,Tax Exempt',
        metaDescription:
          'Great performance. Outstanding value Get the job done with business-ready desktops offering superb value with strong performance, exceptional security and ',
        attributeNames: {
          processor_cache: 'Processor cache type',
          bus_type: 'Bus type',
          processor_threads: 'Processor Threads',
          tcase: 'Tcase',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/115_27295368',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '115',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '115_26440118',
      attributes: {
        sku: '115_26440118',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '115',
        name: 'DELL OptiPlex 3020',
        description:
          'Great performance. Outstanding value Get the job done with business-ready desktops offering superb value with strong performance, exceptional security and easy serviceability. Stop advanced threats and zero-day attacks with Dell Data Protection | Protected Workspace — a proactive, real-time solution for malware protection. Ensure authorized access through multifactor, single sign-on (SSO) and preboot authentication with Dell Data Protection | Security Tools. Streamline administration with integration into Dell KACE appliances, Microsoft System Center and industry-standard tools. Deploy with flexibility through multiple chassis options. Select the small form factor chassis, optimized for constrained workspaces, or the expandable mini tower with support for up to four PCIe cards.',
        attributes: {
          processor_cache: '3 MB',
          bus_type: 'DMI',
          processor_threads: '2',
          tcase: '72 °',
          brand: 'DELL',
          processor_frequency: '3.6 GHz',
        },
        superAttributesDefinition: ['processor_cache', 'processor_frequency'],
        metaTitle: 'DELL OptiPlex 3020',
        metaKeywords: 'DELL,Tax Exempt',
        metaDescription:
          'Great performance. Outstanding value Get the job done with business-ready desktops offering superb value with strong performance, exceptional security and ',
        attributeNames: {
          processor_cache: 'Processor cache type',
          bus_type: 'Bus type',
          processor_threads: 'Processor Threads',
          tcase: 'Tcase',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/115_26440118',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '115',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '115_26408656',
      attributes: {
        sku: '115_26408656',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '115',
        name: 'DELL OptiPlex 3020',
        description:
          'Great performance. Outstanding value Get the job done with business-ready desktops offering superb value with strong performance, exceptional security and easy serviceability. Stop advanced threats and zero-day attacks with Dell Data Protection | Protected Workspace — a proactive, real-time solution for malware protection. Ensure authorized access through multifactor, single sign-on (SSO) and preboot authentication with Dell Data Protection | Security Tools. Streamline administration with integration into Dell KACE appliances, Microsoft System Center and industry-standard tools. Deploy with flexibility through multiple chassis options. Select the small form factor chassis, optimized for constrained workspaces, or the expandable mini tower with support for up to four PCIe cards.',
        attributes: {
          processor_cache: '3 MB',
          bus_type: 'DMI',
          processor_threads: '2',
          tcase: '72 °',
          brand: 'DELL',
          processor_frequency: '3.3 GHz',
        },
        superAttributesDefinition: ['processor_cache', 'processor_frequency'],
        metaTitle: 'DELL OptiPlex 3020',
        metaKeywords: 'DELL,Tax Exempt',
        metaDescription:
          'Great performance. Outstanding value Get the job done with business-ready desktops offering superb value with strong performance, exceptional security and ',
        attributeNames: {
          processor_cache: 'Processor cache type',
          bus_type: 'Bus type',
          processor_threads: 'Processor Threads',
          tcase: 'Tcase',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/115_26408656',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '115',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '115',
      attributes: {
        sku: '115',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'DELL OptiPlex 3020',
        description:
          'Great performance. Outstanding value Get the job done with business-ready desktops offering superb value with strong performance, exceptional security and easy serviceability. Stop advanced threats and zero-day attacks with Dell Data Protection | Protected Workspace — a proactive, real-time solution for malware protection. Ensure authorized access through multifactor, single sign-on (SSO) and preboot authentication with Dell Data Protection | Security Tools. Streamline administration with integration into Dell KACE appliances, Microsoft System Center and industry-standard tools. Deploy with flexibility through multiple chassis options. Select the small form factor chassis, optimized for constrained workspaces, or the expandable mini tower with support for up to four PCIe cards.',
        attributes: {
          processor_cache: '3 MB',
          bus_type: 'DMI',
          processor_threads: '2',
          tcase: '72 °',
          brand: 'DELL',
        },
        superAttributesDefinition: ['processor_cache'],
        superAttributes: {
          processor_frequency: ['3.2 GHz', '3.6 GHz', '3.3 GHz'],
        },
        attributeMap: {
          super_attributes: {
            processor_frequency: ['3.2 GHz', '3.6 GHz', '3.3 GHz'],
          },
          product_concrete_ids: [
            '115_27295368',
            '115_26440118',
            '115_26408656',
          ],
          attribute_variants: [],
          attribute_variant_map: {
            '142': {
              processor_frequency: '3.2 GHz',
            },
            '143': {
              processor_frequency: '3.6 GHz',
            },
            '144': {
              processor_frequency: '3.3 GHz',
            },
          },
        },
        metaTitle: 'DELL OptiPlex 3020',
        metaKeywords: 'DELL,Tax Exempt',
        metaDescription:
          'Great performance. Outstanding value Get the job done with business-ready desktops offering superb value with strong performance, exceptional security and ',
        attributeNames: {
          processor_cache: 'Processor cache type',
          bus_type: 'Bus type',
          processor_threads: 'Processor Threads',
          tcase: 'Tcase',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        url: '/en/dell-optiplex-3020-115',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/115',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '115_27295368',
            },
            {
              type: 'concrete-products',
              id: '115_26440118',
            },
            {
              type: 'concrete-products',
              id: '115_26408656',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '119_29804808',
      attributes: {
        sku: '119_29804808',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '119',
        name: 'Fujitsu ESPRIMO E920',
        description:
          "Green IT Fujitsu is committed to eliminating the use of harmful and potentially harmful substances in its products and production processes in order to minimize risk to end users and to the environment. This strategy is captured in Environmental Guideline FTS03230 and forms the basis on which all Fujitsu's products are designed. Especially for Fujitsu ESPRIMO PCs this means that all used printed circuit boards are halogen free. Furthermore they are compliant with several certificates awarding environmental conscience such as ENERGY STAR® and EPEAT. As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently try to improve the energy efficiency of our products. The Fujitsu ESPRIMO E920 features latest technology regarding Intel® chipset and processor and optional an up to 94% energy efficient power supply. Furthermore it delivers enhanced power management settings and optional 0-Watt power consumption in off-mode.",
        attributes: {
          internal_memory: '32 GB',
          intel_smart_cache: 'yes',
          product_type: 'PC',
          processor_cache: '6 MB',
          brand: 'Fujitsu',
          color: 'Silver',
        },
        superAttributesDefinition: [
          'internal_memory',
          'processor_cache',
          'color',
        ],
        metaTitle: 'Fujitsu ESPRIMO E920',
        metaKeywords: 'Fujitsu,Tax Exempt',
        metaDescription:
          'Green IT Fujitsu is committed to eliminating the use of harmful and potentially harmful substances in its products and production processes in order to min',
        attributeNames: {
          internal_memory: 'Max internal memory',
          intel_smart_cache: 'Intel Smart Cache',
          product_type: 'Product type',
          processor_cache: 'Processor cache type',
          brand: 'Brand',
          color: 'Color',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/119_29804808',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '119',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '119',
      attributes: {
        sku: '119',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'Fujitsu ESPRIMO E920',
        description:
          "Green IT Fujitsu is committed to eliminating the use of harmful and potentially harmful substances in its products and production processes in order to minimize risk to end users and to the environment. This strategy is captured in Environmental Guideline FTS03230 and forms the basis on which all Fujitsu's products are designed. Especially for Fujitsu ESPRIMO PCs this means that all used printed circuit boards are halogen free. Furthermore they are compliant with several certificates awarding environmental conscience such as ENERGY STAR® and EPEAT. As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently try to improve the energy efficiency of our products. The Fujitsu ESPRIMO E920 features latest technology regarding Intel® chipset and processor and optional an up to 94% energy efficient power supply. Furthermore it delivers enhanced power management settings and optional 0-Watt power consumption in off-mode.",
        attributes: {
          internal_memory: '32 GB',
          intel_smart_cache: 'yes',
          product_type: 'PC',
          processor_cache: '6 MB',
          brand: 'Fujitsu',
          color: 'Red',
        },
        superAttributesDefinition: [
          'internal_memory',
          'processor_cache',
          'color',
        ],
        superAttributes: {
          color: ['Silver'],
        },
        attributeMap: {
          super_attributes: {
            color: ['Silver'],
          },
          product_concrete_ids: ['119_29804808'],
          attribute_variants: [],
          attribute_variant_map: {
            '150': [],
          },
        },
        metaTitle: 'Fujitsu ESPRIMO E920',
        metaKeywords: 'Fujitsu,Tax Exempt',
        metaDescription:
          'Green IT Fujitsu is committed to eliminating the use of harmful and potentially harmful substances in its products and production processes in order to min',
        attributeNames: {
          internal_memory: 'Max internal memory',
          intel_smart_cache: 'Intel Smart Cache',
          product_type: 'Product type',
          processor_cache: 'Processor cache type',
          brand: 'Brand',
          color: 'Color',
        },
        url: '/en/fujitsu-esprimo-e920-119',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/119',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '119_29804808',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '120_29890350',
      attributes: {
        sku: '120_29890350',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '120',
        name: 'Fujitsu ESPRIMO P556',
        description:
          'High performance and best price/performance ratio As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently try to improve the energy efficiency of our products. The Fujitsu ESPRIMO E920 features latest technology regarding Intel® chipset and processor and optional an up to 94% energy efficient power supply. Furthermore it delivers enhanced power management settings and optional 0-Watt power consumption in off-mode. Outstanding quality and stable functions based on German production standards. The development, production and functionality tests - all under one roof in Germany',
        attributes: {
          processor_operating_models: '64-bit',
          processor_threads: '4',
          processor_cores: '2',
          pci_express_slots_version: '3',
          brand: 'Fujitsu',
          processor_frequency: '3.7 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'Fujitsu ESPRIMO P556',
        metaKeywords: 'Fujitsu,Tax Exempt',
        metaDescription:
          'High performance and best price/performance ratio As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently tr',
        attributeNames: {
          processor_operating_models: 'Processor operating models',
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          pci_express_slots_version: 'PCI Express slots version',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/120_29890350',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '120',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '120_30069636',
      attributes: {
        sku: '120_30069636',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '120',
        name: 'Fujitsu ESPRIMO P556',
        description:
          'High performance and best price/performance ratio As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently try to improve the energy efficiency of our products. The Fujitsu ESPRIMO E920 features latest technology regarding Intel® chipset and processor and optional an up to 94% energy efficient power supply. Furthermore it delivers enhanced power management settings and optional 0-Watt power consumption in off-mode. Outstanding quality and stable functions based on German production standards. The development, production and functionality tests - all under one roof in Germany',
        attributes: {
          processor_operating_models: '64-bit',
          processor_threads: '4',
          processor_cores: '2',
          pci_express_slots_version: '3',
          brand: 'Fujitsu',
          processor_frequency: '3.4 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'Fujitsu ESPRIMO P556',
        metaKeywords: 'Fujitsu,Tax Exempt',
        metaDescription:
          'High performance and best price/performance ratio As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently tr',
        attributeNames: {
          processor_operating_models: 'Processor operating models',
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          pci_express_slots_version: 'PCI Express slots version',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/120_30069636',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '120',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '120_30069631',
      attributes: {
        sku: '120_30069631',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '120',
        name: 'Fujitsu ESPRIMO P556',
        description:
          'High performance and best price/performance ratio As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently try to improve the energy efficiency of our products. The Fujitsu ESPRIMO E920 features latest technology regarding Intel® chipset and processor and optional an up to 94% energy efficient power supply. Furthermore it delivers enhanced power management settings and optional 0-Watt power consumption in off-mode. Outstanding quality and stable functions based on German production standards. The development, production and functionality tests - all under one roof in Germany',
        attributes: {
          processor_operating_models: '64-bit',
          processor_threads: '4',
          processor_cores: '2',
          pci_express_slots_version: '3',
          brand: 'Fujitsu',
          processor_frequency: '2.7 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'Fujitsu ESPRIMO P556',
        metaKeywords: 'Fujitsu,Tax Exempt',
        metaDescription:
          'High performance and best price/performance ratio As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently tr',
        attributeNames: {
          processor_operating_models: 'Processor operating models',
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          pci_express_slots_version: 'PCI Express slots version',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/120_30069631',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '120',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '120',
      attributes: {
        sku: '120',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'Fujitsu ESPRIMO P556',
        description:
          'High performance and best price/performance ratio As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently try to improve the energy efficiency of our products. The Fujitsu ESPRIMO E920 features latest technology regarding Intel® chipset and processor and optional an up to 94% energy efficient power supply. Furthermore it delivers enhanced power management settings and optional 0-Watt power consumption in off-mode. Outstanding quality and stable functions based on German production standards. The development, production and functionality tests - all under one roof in Germany',
        attributes: {
          processor_operating_models: '64-bit',
          processor_threads: '4',
          processor_cores: '2',
          pci_express_slots_version: '3',
          brand: 'Fujitsu',
        },
        superAttributesDefinition: [],
        superAttributes: {
          processor_frequency: ['3.7 GHz', '3.4 GHz', '2.7 GHz'],
        },
        attributeMap: {
          super_attributes: {
            processor_frequency: ['3.7 GHz', '3.4 GHz', '2.7 GHz'],
          },
          product_concrete_ids: [
            '120_29890350',
            '120_30069636',
            '120_30069631',
          ],
          attribute_variants: [],
          attribute_variant_map: {
            '151': {
              processor_frequency: '3.7 GHz',
            },
            '152': {
              processor_frequency: '3.4 GHz',
            },
            '153': {
              processor_frequency: '2.7 GHz',
            },
          },
        },
        metaTitle: 'Fujitsu ESPRIMO P556',
        metaKeywords: 'Fujitsu,Tax Exempt',
        metaDescription:
          'High performance and best price/performance ratio As energy saving is one of the core components of Fujitsu’ approach to the environment, we permanently tr',
        attributeNames: {
          processor_operating_models: 'Processor operating models',
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          pci_express_slots_version: 'PCI Express slots version',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        url: '/en/fujitsu-esprimo-p556-120',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/120',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '120_29890350',
            },
            {
              type: 'concrete-products',
              id: '120_30069636',
            },
            {
              type: 'concrete-products',
              id: '120_30069631',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '121_29406823',
      attributes: {
        sku: '121_29406823',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '121',
        name: 'HP 200 280 G1',
        description:
          'Ready for work The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take on your everyday work at an affordable price with the HP 280 G1 desktop PC. Get the computing power you need while minimizing the total cost of ownership—now that’s a smart investment. The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take up less space than a traditional tower with the HP 280 G1 Micro Tower with a stylish design to compliment your workspace.',
        attributes: {
          system_bus_rate: '5 GT/s',
          stepping: 'C0',
          bus_type: 'DMI',
          thermal_design_power: '65 W',
          brand: 'HP',
          processor_frequency: '3 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'HP 200 280 G1',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Ready for work The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take on your eve',
        attributeNames: {
          system_bus_rate: 'System bus rate',
          stepping: 'Stepping',
          bus_type: 'Bus type',
          thermal_design_power: 'Thermal Design Power (TDP)',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/121_29406823',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '121',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '121_28542963',
      attributes: {
        sku: '121_28542963',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '121',
        name: 'HP 200 280 G1',
        description:
          'Ready for work The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take on your everyday work at an affordable price with the HP 280 G1 desktop PC. Get the computing power you need while minimizing the total cost of ownership—now that’s a smart investment. The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take up less space than a traditional tower with the HP 280 G1 Micro Tower with a stylish design to compliment your workspace.',
        attributes: {
          system_bus_rate: '5 GT/s',
          stepping: 'C0',
          bus_type: 'DMI',
          thermal_design_power: '65 W',
          brand: 'HP',
          processor_frequency: '2.8 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'HP 200 280 G1',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Ready for work The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take on your eve',
        attributeNames: {
          system_bus_rate: 'System bus rate',
          stepping: 'Stepping',
          bus_type: 'Bus type',
          thermal_design_power: 'Thermal Design Power (TDP)',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/121_28542963',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '121',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '121_28549476',
      attributes: {
        sku: '121_28549476',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '121',
        name: 'HP 200 280 G1',
        description:
          'Ready for work The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take on your everyday work at an affordable price with the HP 280 G1 desktop PC. Get the computing power you need while minimizing the total cost of ownership—now that’s a smart investment. The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take up less space than a traditional tower with the HP 280 G1 Micro Tower with a stylish design to compliment your workspace.',
        attributes: {
          system_bus_rate: '5 GT/s',
          stepping: 'C0',
          bus_type: 'DMI',
          thermal_design_power: '65 W',
          brand: 'HP',
          processor_frequency: '3.2 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'HP 200 280 G1',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Ready for work The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take on your eve',
        attributeNames: {
          system_bus_rate: 'System bus rate',
          stepping: 'Stepping',
          bus_type: 'Bus type',
          thermal_design_power: 'Thermal Design Power (TDP)',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/121_28549476',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '121',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '121',
      attributes: {
        sku: '121',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'HP 200 280 G1',
        description:
          'Ready for work The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take on your everyday work at an affordable price with the HP 280 G1 desktop PC. Get the computing power you need while minimizing the total cost of ownership—now that’s a smart investment. The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take up less space than a traditional tower with the HP 280 G1 Micro Tower with a stylish design to compliment your workspace.',
        attributes: {
          system_bus_rate: '5 GT/s',
          stepping: 'C0',
          bus_type: 'DMI',
          thermal_design_power: '65 W',
          brand: 'HP',
        },
        superAttributesDefinition: [],
        superAttributes: {
          processor_frequency: ['3 GHz', '2.8 GHz', '3.2 GHz'],
        },
        attributeMap: {
          super_attributes: {
            processor_frequency: ['3 GHz', '2.8 GHz', '3.2 GHz'],
          },
          product_concrete_ids: [
            '121_29406823',
            '121_28542963',
            '121_28549476',
          ],
          attribute_variants: [],
          attribute_variant_map: {
            '154': {
              processor_frequency: '3 GHz',
            },
            '155': {
              processor_frequency: '2.8 GHz',
            },
            '156': {
              processor_frequency: '3.2 GHz',
            },
          },
        },
        metaTitle: 'HP 200 280 G1',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Ready for work The HP 280 G1 MT provides a strong performing PC for your agency with the tools you need to accomplish your everyday tasks. Take on your eve',
        attributeNames: {
          system_bus_rate: 'System bus rate',
          stepping: 'Stepping',
          bus_type: 'Bus type',
          thermal_design_power: 'Thermal Design Power (TDP)',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        url: '/en/hp-200-280-g1-121',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/121',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '121_29406823',
            },
            {
              type: 'concrete-products',
              id: '121_28542963',
            },
            {
              type: 'concrete-products',
              id: '121_28549476',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '124_31623088',
      attributes: {
        sku: '124_31623088',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '124',
        name: 'HP ProDesk 400 G3',
        description:
          'New powerful processors Give your business the strong foundation it needs for growth with the affordable and reliable HP ProDesk 400 SFF. Designed with essential security and manageability features, the HP ProDesk 400 helps keep your business growing. New 6th Gen Intel® Core™ processors bring powerful processing with Intel® HD 530 Graphics. Available DDR4 memory helps meet the demands of today’s businesses. HP ProDesks are rigorously tested to help ensure reliability. During the HP Total Test Process, PCs experience 120,000 hours of performance trials to help get you through your business day. The HP ProDesk 400 SFF helps affordably build a solid IT infrastructure for your growing business and fits in smaller workspaces for easy deployment.',
        attributes: {
          processor_codename: 'Skylake',
          bus_type: 'DMI3',
          processor_threads: '4',
          processor_cores: '2',
          brand: 'HP',
          total_storage_capacity: '128 GB',
        },
        superAttributesDefinition: ['total_storage_capacity'],
        metaTitle: 'HP ProDesk 400 G3',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'New powerful processors Give your business the strong foundation it needs for growth with the affordable and reliable HP ProDesk 400 SFF. Designed with ess',
        attributeNames: {
          processor_codename: 'Processor codename',
          bus_type: 'Bus type',
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          brand: 'Brand',
          total_storage_capacity: 'Total storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/124_31623088',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '124',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '124_29866591',
      attributes: {
        sku: '124_29866591',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '124',
        name: 'HP ProDesk 400 G3',
        description:
          'New powerful processors Give your business the strong foundation it needs for growth with the affordable and reliable HP ProDesk 400 SFF. Designed with essential security and manageability features, the HP ProDesk 400 helps keep your business growing. New 6th Gen Intel® Core™ processors bring powerful processing with Intel® HD 530 Graphics. Available DDR4 memory helps meet the demands of today’s businesses. HP ProDesks are rigorously tested to help ensure reliability. During the HP Total Test Process, PCs experience 120,000 hours of performance trials to help get you through your business day. The HP ProDesk 400 SFF helps affordably build a solid IT infrastructure for your growing business and fits in smaller workspaces for easy deployment.',
        attributes: {
          processor_codename: 'Skylake',
          bus_type: 'DMI3',
          processor_threads: '4',
          processor_cores: '2',
          brand: 'HP',
          total_storage_capacity: '500 GB',
        },
        superAttributesDefinition: ['total_storage_capacity'],
        metaTitle: 'HP ProDesk 400 G3',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'New powerful processors Give your business the strong foundation it needs for growth with the affordable and reliable HP ProDesk 400 SFF. Designed with ess',
        attributeNames: {
          processor_codename: 'Processor codename',
          bus_type: 'Bus type',
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          brand: 'Brand',
          total_storage_capacity: 'Total storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/124_29866591',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '124',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '124',
      attributes: {
        sku: '124',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'HP ProDesk 400 G3',
        description:
          'New powerful processors Give your business the strong foundation it needs for growth with the affordable and reliable HP ProDesk 400 SFF. Designed with essential security and manageability features, the HP ProDesk 400 helps keep your business growing. New 6th Gen Intel® Core™ processors bring powerful processing with Intel® HD 530 Graphics. Available DDR4 memory helps meet the demands of today’s businesses. HP ProDesks are rigorously tested to help ensure reliability. During the HP Total Test Process, PCs experience 120,000 hours of performance trials to help get you through your business day. The HP ProDesk 400 SFF helps affordably build a solid IT infrastructure for your growing business and fits in smaller workspaces for easy deployment. ',
        attributes: {
          processor_codename: 'Skylake',
          bus_type: 'DMI3',
          processor_threads: '4',
          processor_cores: '2',
          brand: 'HP',
        },
        superAttributesDefinition: [],
        superAttributes: {
          total_storage_capacity: ['128 GB', '500 GB'],
        },
        attributeMap: {
          super_attributes: {
            total_storage_capacity: ['128 GB', '500 GB'],
          },
          product_concrete_ids: ['124_31623088', '124_29866591'],
          attribute_variants: [],
          attribute_variant_map: {
            '162': {
              total_storage_capacity: '128 GB',
            },
            '163': {
              total_storage_capacity: '500 GB',
            },
          },
        },
        metaTitle: 'HP ProDesk 400 G3',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'New powerful processors Give your business the strong foundation it needs for growth with the affordable and reliable HP ProDesk 400 SFF. Designed with ess',
        attributeNames: {
          processor_codename: 'Processor codename',
          bus_type: 'Bus type',
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          brand: 'Brand',
          total_storage_capacity: 'Total storage capacity',
        },
        url: '/en/hp-prodesk-400-g3-124',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/124',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '124_31623088',
            },
            {
              type: 'concrete-products',
              id: '124_29866591',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '125_30703764',
      attributes: {
        sku: '125_30703764',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '125',
        name: 'HP ProDesk 600 G2',
        description:
          'Perform at the speed of work Power through your day with speed and performance. Get the latest in processing technology with your choice of 6th Generation Intel® Core™ processors and Intel® HD 530 Graphics. IT efficiency reigns supreme when it’s backed by a full portfolio of security solutions, including HP BIOSphere and Device Guard4 available on Windows 101 Enterprise Edition. IT efficiency reigns supreme when it’s backed by a full portfolio of security solutions, including HP BIOSphere and Device Guard4 available on Windows 101 Enterprise Edition. The HP ProDesk 600 Desktop MT/SFF delivers powerful performance, security, and manageability at a value that enables you to keep focused on your businesses.',
        attributes: {
          processor_cores: '4',
          thermal_design_power: '65 W',
          bus_type: 'DMI3',
          system_bus_rate: '8 GT/s',
          brand: 'HP',
          processor_frequency: '3.2 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'HP ProDesk 600 G2',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Perform at the speed of work Power through your day with speed and performance. Get the latest in processing technology with your choice of 6th Generation',
        attributeNames: {
          processor_cores: 'Processor cores',
          thermal_design_power: 'Thermal Design Power (TDP)',
          bus_type: 'Bus type',
          system_bus_rate: 'System bus rate',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/125_30703764',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '125',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '125_30350012',
      attributes: {
        sku: '125_30350012',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '125',
        name: 'HP ProDesk 600 G2',
        description:
          'Perform at the speed of work Power through your day with speed and performance. Get the latest in processing technology with your choice of 6th Generation Intel® Core™ processors and Intel® HD 530 Graphics. IT efficiency reigns supreme when it’s backed by a full portfolio of security solutions, including HP BIOSphere and Device Guard4 available on Windows 101 Enterprise Edition. IT efficiency reigns supreme when it’s backed by a full portfolio of security solutions, including HP BIOSphere and Device Guard4 available on Windows 101 Enterprise Edition. The HP ProDesk 600 Desktop MT/SFF delivers powerful performance, security, and manageability at a value that enables you to keep focused on your businesses.',
        attributes: {
          processor_cores: '4',
          thermal_design_power: '65 W',
          bus_type: 'DMI3',
          system_bus_rate: '8 GT/s',
          brand: 'HP',
          processor_frequency: '3.7 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'HP ProDesk 600 G2',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Perform at the speed of work Power through your day with speed and performance. Get the latest in processing technology with your choice of 6th Generation',
        attributeNames: {
          processor_cores: 'Processor cores',
          thermal_design_power: 'Thermal Design Power (TDP)',
          bus_type: 'Bus type',
          system_bus_rate: 'System bus rate',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/125_30350012',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '125',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '125',
      attributes: {
        sku: '125',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'HP ProDesk 600 G2',
        description:
          'Perform at the speed of work Power through your day with speed and performance. Get the latest in processing technology with your choice of 6th Generation Intel® Core™ processors and Intel® HD 530 Graphics. IT efficiency reigns supreme when it’s backed by a full portfolio of security solutions, including HP BIOSphere and Device Guard4 available on Windows 101 Enterprise Edition. IT efficiency reigns supreme when it’s backed by a full portfolio of security solutions, including HP BIOSphere and Device Guard4 available on Windows 101 Enterprise Edition. The HP ProDesk 600 Desktop MT/SFF delivers powerful performance, security, and manageability at a value that enables you to keep focused on your businesses.        ',
        attributes: {
          processor_cores: '4',
          thermal_design_power: '65 W',
          bus_type: 'DMI3',
          system_bus_rate: '8 GT/s',
          brand: 'HP',
        },
        superAttributesDefinition: [],
        superAttributes: {
          processor_frequency: ['3.2 GHz', '3.7 GHz'],
        },
        attributeMap: {
          super_attributes: {
            processor_frequency: ['3.2 GHz', '3.7 GHz'],
          },
          product_concrete_ids: ['125_30703764', '125_30350012'],
          attribute_variants: [],
          attribute_variant_map: {
            '164': {
              processor_frequency: '3.2 GHz',
            },
            '165': {
              processor_frequency: '3.7 GHz',
            },
          },
        },
        metaTitle: 'HP ProDesk 600 G2',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Perform at the speed of work Power through your day with speed and performance. Get the latest in processing technology with your choice of 6th Generation',
        attributeNames: {
          processor_cores: 'Processor cores',
          thermal_design_power: 'Thermal Design Power (TDP)',
          bus_type: 'Bus type',
          system_bus_rate: 'System bus rate',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        url: '/en/hp-prodesk-600-g2-125',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/125',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '125_30703764',
            },
            {
              type: 'concrete-products',
              id: '125_30350012',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '127_22828284',
      attributes: {
        sku: '127_22828284',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '127',
        name: 'HP Z 620',
        description:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of computing and visualization power into a quiet, compact footprint. This dual-socket system helps you boost productivity with next-generation Intel® Xeon® processors and support for up to 8 displays. Get massive system performance with a small footprint. The HP Z620 features the next evolution in processor technology and system architecture, setting the standard for versatility with support for a single Intel E5-1600 Series Xeon® processor or dual Intel E5-2600 Series Xeon® processors. With 800W 90% efficient power supply and support for up to 8 displays, the HP Z620 gives you the freedom of doing and seeing more.',
        attributes: {
          processor_frequency: '2.1 GHz',
          processor_cache: '15 MB',
          processor_threads: '12',
          fsb_parity: 'no',
          brand: 'HP',
          total_storage_capacity: '240 GB',
        },
        superAttributesDefinition: [
          'processor_frequency',
          'processor_cache',
          'total_storage_capacity',
        ],
        metaTitle: 'HP Z 620',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of com',
        attributeNames: {
          processor_frequency: 'Processor frequency',
          processor_cache: 'Processor cache type',
          processor_threads: 'Processor Threads',
          fsb_parity: 'FSB Parity',
          brand: 'Brand',
          total_storage_capacity: 'Total storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/127_22828284',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '127',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '127_22613708',
      attributes: {
        sku: '127_22613708',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '127',
        name: 'HP Z 620',
        description:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of computing and visualization power into a quiet, compact footprint. This dual-socket system helps you boost productivity with next-generation Intel® Xeon® processors and support for up to 8 displays. Get massive system performance with a small footprint. The HP Z620 features the next evolution in processor technology and system architecture, setting the standard for versatility with support for a single Intel E5-1600 Series Xeon® processor or dual Intel E5-2600 Series Xeon® processors. With 800W 90% efficient power supply and support for up to 8 displays, the HP Z620 gives you the freedom of doing and seeing more.',
        attributes: {
          processor_frequency: '2.1 GHz',
          processor_cache: '15 MB',
          processor_threads: '12',
          fsb_parity: 'no',
          brand: 'HP',
          total_storage_capacity: '256 GB',
        },
        superAttributesDefinition: [
          'processor_frequency',
          'processor_cache',
          'total_storage_capacity',
        ],
        metaTitle: 'HP Z 620',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of com',
        attributeNames: {
          processor_frequency: 'Processor frequency',
          processor_cache: 'Processor cache type',
          processor_threads: 'Processor Threads',
          fsb_parity: 'FSB Parity',
          brand: 'Brand',
          total_storage_capacity: 'Total storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/127_22613708',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '127',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '127_20723326',
      attributes: {
        sku: '127_20723326',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '127',
        name: 'HP Z 620',
        description:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of computing and visualization power into a quiet, compact footprint. This dual-socket system helps you boost productivity with next-generation Intel® Xeon® processors and support for up to 8 displays. Get massive system performance with a small footprint. The HP Z620 features the next evolution in processor technology and system architecture, setting the standard for versatility with support for a single Intel E5-1600 Series Xeon® processor or dual Intel E5-2600 Series Xeon® processors. With 800W 90% efficient power supply and support for up to 8 displays, the HP Z620 gives you the freedom of doing and seeing more.',
        attributes: {
          processor_frequency: '2.1 GHz',
          processor_cache: '15 MB',
          processor_threads: '12',
          fsb_parity: 'no',
          brand: 'HP',
          total_storage_capacity: '1000 GB',
        },
        superAttributesDefinition: [
          'processor_frequency',
          'processor_cache',
          'total_storage_capacity',
        ],
        metaTitle: 'HP Z 620',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of com',
        attributeNames: {
          processor_frequency: 'Processor frequency',
          processor_cache: 'Processor cache type',
          processor_threads: 'Processor Threads',
          fsb_parity: 'FSB Parity',
          brand: 'Brand',
          total_storage_capacity: 'Total storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/127_20723326',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '127',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '127_22613709',
      attributes: {
        sku: '127_22613709',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '127',
        name: 'HP Z 620',
        description:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of computing and visualization power into a quiet, compact footprint. This dual-socket system helps you boost productivity with next-generation Intel® Xeon® processors and support for up to 8 displays. Get massive system performance with a small footprint. The HP Z620 features the next evolution in processor technology and system architecture, setting the standard for versatility with support for a single Intel E5-1600 Series Xeon® processor or dual Intel E5-2600 Series Xeon® processors. With 800W 90% efficient power supply and support for up to 8 displays, the HP Z620 gives you the freedom of doing and seeing more.',
        attributes: {
          processor_frequency: '2.1 GHz',
          processor_cache: '15 MB',
          processor_threads: '12',
          fsb_parity: 'no',
          brand: 'HP',
          total_storage_capacity: '512 GB',
        },
        superAttributesDefinition: [
          'processor_frequency',
          'processor_cache',
          'total_storage_capacity',
        ],
        metaTitle: 'HP Z 620',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of com',
        attributeNames: {
          processor_frequency: 'Processor frequency',
          processor_cache: 'Processor cache type',
          processor_threads: 'Processor Threads',
          fsb_parity: 'FSB Parity',
          brand: 'Brand',
          total_storage_capacity: 'Total storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/127_22613709',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '127',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '127',
      attributes: {
        sku: '127',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'HP Z 620',
        description:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of computing and visualization power into a quiet, compact footprint. This dual-socket system helps you boost productivity with next-generation Intel® Xeon® processors and support for up to 8 displays. Get massive system performance with a small footprint. The HP Z620 features the next evolution in processor technology and system architecture, setting the standard for versatility with support for a single Intel E5-1600 Series Xeon® processor or dual Intel E5-2600 Series Xeon® processors. With 800W 90% efficient power supply and support for up to 8 displays, the HP Z620 gives you the freedom of doing and seeing more.',
        attributes: {
          processor_frequency: '2.1 GHz',
          processor_cache: '15 MB',
          processor_threads: '12',
          fsb_parity: 'no',
          brand: 'HP',
        },
        superAttributesDefinition: ['processor_frequency', 'processor_cache'],
        superAttributes: {
          total_storage_capacity: ['240 GB', '256 GB', '1000 GB', '512 GB'],
        },
        attributeMap: {
          super_attributes: {
            total_storage_capacity: ['240 GB', '256 GB', '1000 GB', '512 GB'],
          },
          product_concrete_ids: [
            '127_22828284',
            '127_22613708',
            '127_20723326',
            '127_22613709',
          ],
          attribute_variants: [],
          attribute_variant_map: {
            '169': {
              total_storage_capacity: '240 GB',
            },
            '170': {
              total_storage_capacity: '256 GB',
            },
            '171': {
              total_storage_capacity: '1000 GB',
            },
            '172': {
              total_storage_capacity: '512 GB',
            },
          },
        },
        metaTitle: 'HP Z 620',
        metaKeywords: 'HP,Tax Exempt',
        metaDescription:
          'Big Possibilities. Compact Form Factor. More versatile than ever before. With up to 16 discrete processor cores, the HP Z620 Workstation packs a ton of com',
        attributeNames: {
          processor_frequency: 'Processor frequency',
          processor_cache: 'Processor cache type',
          processor_threads: 'Processor Threads',
          fsb_parity: 'FSB Parity',
          brand: 'Brand',
          total_storage_capacity: 'Total storage capacity',
        },
        url: '/en/hp-z-620-127',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/127',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '127_22828284',
            },
            {
              type: 'concrete-products',
              id: '127_22613708',
            },
            {
              type: 'concrete-products',
              id: '127_20723326',
            },
            {
              type: 'concrete-products',
              id: '127_22613709',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '129_30706500',
      attributes: {
        sku: '129_30706500',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '129',
        name: 'Lenovo ThinkCenter E73',
        description:
          'Eco-friendly and Energy Efficient Lenovo Desktop Power Manager lets you balance power management and performance to save energy and lower costs. The E73 is also ENERGY STAR compliant, EPEAT® Gold and Cisco EnergyWise™ certified—so you can feel good about the planet and your bottom line. With SuperSpeed USB 3.0, transfer data up to 10 times faster than previous USB technologies. You can also connect to audio- and video-related devices with WiFi and Bluetooth® technology. With 10% more processing power, 4th generation Intel® Core™ processors deliver the performance to increase business productivity for your business. They can also guard against identity theft and ensure safe access to your network with built-in security features.',
        attributes: {
          processor_threads: '8',
          processor_cores: '4',
          processor_codename: 'Haswell',
          pci_express_slots_version: '3',
          brand: 'Lenovo',
          processor_frequency: '3.2 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'Lenovo ThinkCenter E73',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Eco-friendly and Energy Efficient Lenovo Desktop Power Manager lets you balance power management and performance to save energy and lower costs. The E73 is',
        attributeNames: {
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          processor_codename: 'Processor codename',
          pci_express_slots_version: 'PCI Express slots version',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/129_30706500',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '129',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '129_27107297',
      attributes: {
        sku: '129_27107297',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '129',
        name: 'Lenovo ThinkCenter E73',
        description:
          'Eco-friendly and Energy Efficient Lenovo Desktop Power Manager lets you balance power management and performance to save energy and lower costs. The E73 is also ENERGY STAR compliant, EPEAT® Gold and Cisco EnergyWise™ certified—so you can feel good about the planet and your bottom line. With SuperSpeed USB 3.0, transfer data up to 10 times faster than previous USB technologies. You can also connect to audio- and video-related devices with WiFi and Bluetooth® technology. With 10% more processing power, 4th generation Intel® Core™ processors deliver the performance to increase business productivity for your business. They can also guard against identity theft and ensure safe access to your network with built-in security features.',
        attributes: {
          processor_threads: '8',
          processor_cores: '4',
          processor_codename: 'Haswell',
          pci_express_slots_version: '3',
          brand: 'Lenovo',
          processor_frequency: '3.6 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'Lenovo ThinkCenter E73',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Eco-friendly and Energy Efficient Lenovo Desktop Power Manager lets you balance power management and performance to save energy and lower costs. The E73 is',
        attributeNames: {
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          processor_codename: 'Processor codename',
          pci_express_slots_version: 'PCI Express slots version',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/129_27107297',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '129',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '129_24325712',
      attributes: {
        sku: '129_24325712',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '129',
        name: 'Lenovo ThinkCenter E73',
        description:
          'Eco-friendly and Energy Efficient Lenovo Desktop Power Manager lets you balance power management and performance to save energy and lower costs. The E73 is also ENERGY STAR compliant, EPEAT® Gold and Cisco EnergyWise™ certified—so you can feel good about the planet and your bottom line. With SuperSpeed USB 3.0, transfer data up to 10 times faster than previous USB technologies. You can also connect to audio- and video-related devices with WiFi and Bluetooth® technology. With 10% more processing power, 4th generation Intel® Core™ processors deliver the performance to increase business productivity for your business. They can also guard against identity theft and ensure safe access to your network with built-in security features.',
        attributes: {
          processor_threads: '8',
          processor_cores: '4',
          processor_codename: 'Haswell',
          pci_express_slots_version: '3',
          brand: 'Lenovo',
          processor_frequency: '3 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'Lenovo ThinkCenter E73',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Eco-friendly and Energy Efficient Lenovo Desktop Power Manager lets you balance power management and performance to save energy and lower costs. The E73 is',
        attributeNames: {
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          processor_codename: 'Processor codename',
          pci_express_slots_version: 'PCI Express slots version',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/129_24325712',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '129',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '129',
      attributes: {
        sku: '129',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'Lenovo ThinkCenter E73',
        description:
          'Eco-friendly and Energy Efficient Lenovo Desktop Power Manager lets you balance power management and performance to save energy and lower costs. The E73 is also ENERGY STAR compliant, EPEAT® Gold and Cisco EnergyWise™ certified—so you can feel good about the planet and your bottom line. With SuperSpeed USB 3.0, transfer data up to 10 times faster than previous USB technologies. You can also connect to audio- and video-related devices with WiFi and Bluetooth® technology. With 10% more processing power, 4th generation Intel® Core™ processors deliver the performance to increase business productivity for your business. They can also guard against identity theft and ensure safe access to your network with built-in security features.',
        attributes: {
          processor_threads: '8',
          processor_cores: '4',
          processor_codename: 'Haswell',
          pci_express_slots_version: '3',
          brand: 'Lenovo',
        },
        superAttributesDefinition: [],
        superAttributes: {
          processor_frequency: ['3.2 GHz', '3.6 GHz', '3 GHz'],
        },
        attributeMap: {
          super_attributes: {
            processor_frequency: ['3.2 GHz', '3.6 GHz', '3 GHz'],
          },
          product_concrete_ids: [
            '129_30706500',
            '129_27107297',
            '129_24325712',
          ],
          attribute_variants: [],
          attribute_variant_map: {
            '175': {
              processor_frequency: '3.2 GHz',
            },
            '176': {
              processor_frequency: '3.6 GHz',
            },
            '177': {
              processor_frequency: '3 GHz',
            },
          },
        },
        metaTitle: 'Lenovo ThinkCenter E73',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Eco-friendly and Energy Efficient Lenovo Desktop Power Manager lets you balance power management and performance to save energy and lower costs. The E73 is',
        attributeNames: {
          processor_threads: 'Processor Threads',
          processor_cores: 'Processor cores',
          processor_codename: 'Processor codename',
          pci_express_slots_version: 'PCI Express slots version',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        url: '/en/lenovo-thinkcenter-e73-129',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/129',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '129_30706500',
            },
            {
              type: 'concrete-products',
              id: '129_27107297',
            },
            {
              type: 'concrete-products',
              id: '129_24325712',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '130_29285281',
      attributes: {
        sku: '130_29285281',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '130',
        name: 'Lenovo ThinkStation P300',
        description:
          'Optional Flex Module The innovative Flex Module lets you customize I/O ports, so you add only what you need. With the 2 available 5.25" bays on the P300 Tower, you can mix and match components including an ultraslim ODD, 29-in-1 media card reader, Firewire, and eSATA – up to 8 configurations among an ODD, HDD, and Flex Module. We\'ve redesigned our ThinkStations. No more bulky handles, just a clean-looking, functional design. An extended lip on the top lid that includes a red touch point, combined with a ledge on the back-side, make the P300 exceptionally easy to lift and carry. The P300 workstation features a 15-month life cycle with no planned hardware changes that affect the preloaded software image. Image stability for long-term deployments helps to reduce transition, qualification, and testing costs to ensure savings for your business.',
        attributes: {
          processor_cores: '4',
          processor_threads: '8',
          bus_type: 'DMI',
          stepping: 'C0',
          brand: 'Lenovo',
          processor_frequency: '3.6 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'Lenovo ThinkStation P300',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Optional Flex Module The innovative Flex Module lets you customize I/O ports, so you add only what you need. With the 2 available 5.25" bays on the P300 To',
        attributeNames: {
          processor_cores: 'Processor cores',
          processor_threads: 'Processor Threads',
          bus_type: 'Bus type',
          stepping: 'Stepping',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/130_29285281',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '130',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '130_24326086',
      attributes: {
        sku: '130_24326086',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '130',
        name: 'Lenovo ThinkStation P300',
        description:
          'Optional Flex Module The innovative Flex Module lets you customize I/O ports, so you add only what you need. With the 2 available 5.25" bays on the P300 Tower, you can mix and match components including an ultraslim ODD, 29-in-1 media card reader, Firewire, and eSATA – up to 8 configurations among an ODD, HDD, and Flex Module. We\'ve redesigned our ThinkStations. No more bulky handles, just a clean-looking, functional design. An extended lip on the top lid that includes a red touch point, combined with a ledge on the back-side, make the P300 exceptionally easy to lift and carry. The P300 workstation features a 15-month life cycle with no planned hardware changes that affect the preloaded software image. Image stability for long-term deployments helps to reduce transition, qualification, and testing costs to ensure savings for your business.',
        attributes: {
          processor_cores: '4',
          processor_threads: '8',
          bus_type: 'DMI',
          stepping: 'C0',
          brand: 'Lenovo',
          processor_frequency: '3.3 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'Lenovo ThinkStation P300',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Optional Flex Module The innovative Flex Module lets you customize I/O ports, so you add only what you need. With the 2 available 5.25" bays on the P300 To',
        attributeNames: {
          processor_cores: 'Processor cores',
          processor_threads: 'Processor Threads',
          bus_type: 'Bus type',
          stepping: 'Stepping',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/130_24326086',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '130',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '130_24725761',
      attributes: {
        sku: '130_24725761',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '130',
        name: 'Lenovo ThinkStation P300',
        description:
          'Optional Flex Module The innovative Flex Module lets you customize I/O ports, so you add only what you need. With the 2 available 5.25" bays on the P300 Tower, you can mix and match components including an ultraslim ODD, 29-in-1 media card reader, Firewire, and eSATA – up to 8 configurations among an ODD, HDD, and Flex Module. We\'ve redesigned our ThinkStations. No more bulky handles, just a clean-looking, functional design. An extended lip on the top lid that includes a red touch point, combined with a ledge on the back-side, make the P300 exceptionally easy to lift and carry. The P300 workstation features a 15-month life cycle with no planned hardware changes that affect the preloaded software image. Image stability for long-term deployments helps to reduce transition, qualification, and testing costs to ensure savings for your business.',
        attributes: {
          processor_cores: '4',
          processor_threads: '8',
          bus_type: 'DMI',
          stepping: 'C0',
          brand: 'Lenovo',
          processor_frequency: '3.5 GHz',
        },
        superAttributesDefinition: ['processor_frequency'],
        metaTitle: 'Lenovo ThinkStation P300',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Optional Flex Module The innovative Flex Module lets you customize I/O ports, so you add only what you need. With the 2 available 5.25" bays on the P300 To',
        attributeNames: {
          processor_cores: 'Processor cores',
          processor_threads: 'Processor Threads',
          bus_type: 'Bus type',
          stepping: 'Stepping',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/130_24725761',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '130',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '130',
      attributes: {
        sku: '130',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'Lenovo ThinkStation P300',
        description:
          'Optional Flex Module The innovative Flex Module lets you customize I/O ports, so you add only what you need. With the 2 available 5.25" bays on the P300 Tower, you can mix and match components including an ultraslim ODD, 29-in-1 media card reader, Firewire, and eSATA – up to 8 configurations among an ODD, HDD, and Flex Module. We\'ve redesigned our ThinkStations. No more bulky handles, just a clean-looking, functional design. An extended lip on the top lid that includes a red touch point, combined with a ledge on the back-side, make the P300 exceptionally easy to lift and carry. The P300 workstation features a 15-month life cycle with no planned hardware changes that affect the preloaded software image. Image stability for long-term deployments helps to reduce transition, qualification, and testing costs to ensure savings for your business.',
        attributes: {
          processor_cores: '4',
          processor_threads: '8',
          bus_type: 'DMI',
          stepping: 'C0',
          brand: 'Lenovo',
        },
        superAttributesDefinition: [],
        superAttributes: {
          processor_frequency: ['3.6 GHz', '3.3 GHz', '3.5 GHz'],
        },
        attributeMap: {
          super_attributes: {
            processor_frequency: ['3.6 GHz', '3.3 GHz', '3.5 GHz'],
          },
          product_concrete_ids: [
            '130_29285281',
            '130_24326086',
            '130_24725761',
          ],
          attribute_variants: [],
          attribute_variant_map: {
            '178': {
              processor_frequency: '3.6 GHz',
            },
            '179': {
              processor_frequency: '3.3 GHz',
            },
            '180': {
              processor_frequency: '3.5 GHz',
            },
          },
        },
        metaTitle: 'Lenovo ThinkStation P300',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Optional Flex Module The innovative Flex Module lets you customize I/O ports, so you add only what you need. With the 2 available 5.25" bays on the P300 To',
        attributeNames: {
          processor_cores: 'Processor cores',
          processor_threads: 'Processor Threads',
          bus_type: 'Bus type',
          stepping: 'Stepping',
          brand: 'Brand',
          processor_frequency: 'Processor frequency',
        },
        url: '/en/lenovo-thinkstation-p300-130',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/130',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '130_29285281',
            },
            {
              type: 'concrete-products',
              id: '130_24326086',
            },
            {
              type: 'concrete-products',
              id: '130_24725761',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '131_24872891',
      attributes: {
        sku: '131_24872891',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '131',
        name: 'Lenovo ThinkStation P900',
        description:
          'Thermal Design: Elegant & Efficient. Patented tri-channel cooling with just 3 system fans – as opposed to 10 that other workstations typically rely on — and a direct cooling air baffle directs fresh air into the CPU and memory. ThinkStation P900 delivers new technologies and design to keep your workstation cool and quiet. The innovative Flex Module lets you customize I/O ports, so you add only what you need. Using the 5.25" bays, you can mix and match components including an ultraslim ODD, 29-in-1 media card reader, Firewire, and eSATA. The Flex Connector is a mezzanine card that fits into the motherboard and allows for expanded storage and I/O, without sacrificing the use of rear PCI. It supports SATA/SAS/PCIe advanced RAID solution. ThinkStation P900 includes two available connectors (enabled with each CPU).',
        attributes: {
          processor_frequency: '2.4 GHz',
          processor_cores: '6',
          processor_threads: '12',
          stepping: 'R2',
          brand: 'Lenovo',
          color: 'Silver',
        },
        superAttributesDefinition: ['processor_frequency', 'color'],
        metaTitle: 'Lenovo ThinkStation P900',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Thermal Design: Elegant & Efficient. Patented tri-channel cooling with just 3 system fans – as opposed to 10 that other workstations typically rely on — an',
        attributeNames: {
          processor_frequency: 'Processor frequency',
          processor_cores: 'Processor cores',
          processor_threads: 'Processor Threads',
          stepping: 'Stepping',
          brand: 'Brand',
          color: 'Color',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/131_24872891',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '131',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '131',
      attributes: {
        sku: '131',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'Lenovo ThinkStation P900',
        description:
          'Thermal Design: Elegant & Efficient. Patented tri-channel cooling with just 3 system fans – as opposed to 10 that other workstations typically rely on — and a direct cooling air baffle directs fresh air into the CPU and memory. ThinkStation P900 delivers new technologies and design to keep your workstation cool and quiet. The innovative Flex Module lets you customize I/O ports, so you add only what you need. Using the 5.25" bays, you can mix and match components including an ultraslim ODD, 29-in-1 media card reader, Firewire, and eSATA. The Flex Connector is a mezzanine card that fits into the motherboard and allows for expanded storage and I/O, without sacrificing the use of rear PCI. It supports SATA/SAS/PCIe advanced RAID solution. ThinkStation P900 includes two available connectors (enabled with each CPU).',
        attributes: {
          processor_frequency: '2.4 GHz',
          processor_cores: '6',
          processor_threads: '12',
          stepping: 'R2',
          brand: 'Lenovo',
          color: 'Black',
        },
        superAttributesDefinition: ['processor_frequency', 'color'],
        superAttributes: {
          color: ['Silver'],
        },
        attributeMap: {
          super_attributes: {
            color: ['Silver'],
          },
          product_concrete_ids: ['131_24872891'],
          attribute_variants: [],
          attribute_variant_map: {
            '181': [],
          },
        },
        metaTitle: 'Lenovo ThinkStation P900',
        metaKeywords: 'Lenovo,Tax Exempt',
        metaDescription:
          'Thermal Design: Elegant & Efficient. Patented tri-channel cooling with just 3 system fans – as opposed to 10 that other workstations typically rely on — an',
        attributeNames: {
          processor_frequency: 'Processor frequency',
          processor_cores: 'Processor cores',
          processor_threads: 'Processor Threads',
          stepping: 'Stepping',
          brand: 'Brand',
          color: 'Color',
        },
        url: '/en/lenovo-thinkstation-p900-131',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/131',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '131_24872891',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '167_30375366',
      attributes: {
        sku: '167_30375366',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '167',
        name: 'HP Elite x2 1012 G1',
        description:
          'Mobility and style without compromise Strikingly thin and elegant, the Elite x2 1012 is a 2 in 1 for the mobile workforce and executives who want no compromises when it comes to enterprise-class power, durability, optional LTE connectivity4 and productivity on the go, in a stylish design. Stunning IT friendly design. Elite x2 1012 incorporates Elite global enterprise-class security and manageability features, enterprise-class durability, on-site serviceability,2 global sku availability and support across 180 countries. At your desk or on the road, meet the specific needs of your work day with the included HP Active Pen with App Launch that uses Wacom technology. Accessorize to boost your efficiency. Add optional enterprise docking solutions3 and advanced keyboards.',
        attributes: {
          thermal_design_power: '4.5 W',
          stepping: 'D1',
          processor_cores: '2',
          brand: 'HP',
          color: 'Silver',
          internal_storage_capacity: '512 GB',
        },
        superAttributesDefinition: ['color', 'internal_storage_capacity'],
        metaTitle: 'HP Elite x2 1012 G1',
        metaKeywords: 'HP,Communication Electronics',
        metaDescription:
          'Mobility and style without compromise Strikingly thin and elegant, the Elite x2 1012 is a 2 in 1 for the mobile workforce and executives who want no compro',
        attributeNames: {
          thermal_design_power: 'Thermal Design Power (TDP)',
          stepping: 'Stepping',
          processor_cores: 'Processor cores',
          brand: 'Brand',
          color: 'Color',
          internal_storage_capacity: 'Internal storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/167_30375366',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '167',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '167_30375364',
      attributes: {
        sku: '167_30375364',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '167',
        name: 'HP Elite x2 1012 G1',
        description:
          'Mobility and style without compromise Strikingly thin and elegant, the Elite x2 1012 is a 2 in 1 for the mobile workforce and executives who want no compromises when it comes to enterprise-class power, durability, optional LTE connectivity4 and productivity on the go, in a stylish design. Stunning IT friendly design. Elite x2 1012 incorporates Elite global enterprise-class security and manageability features, enterprise-class durability, on-site serviceability,2 global sku availability and support across 180 countries. At your desk or on the road, meet the specific needs of your work day with the included HP Active Pen with App Launch that uses Wacom technology. Accessorize to boost your efficiency. Add optional enterprise docking solutions3 and advanced keyboards.',
        attributes: {
          thermal_design_power: '4.5 W',
          stepping: 'D1',
          processor_cores: '2',
          brand: 'HP',
          color: 'Silver',
          internal_storage_capacity: '256 GB',
        },
        superAttributesDefinition: ['color', 'internal_storage_capacity'],
        metaTitle: 'HP Elite x2 1012 G1',
        metaKeywords: 'HP,Communication Electronics',
        metaDescription:
          'Mobility and style without compromise Strikingly thin and elegant, the Elite x2 1012 is a 2 in 1 for the mobile workforce and executives who want no compro',
        attributeNames: {
          thermal_design_power: 'Thermal Design Power (TDP)',
          stepping: 'Stepping',
          processor_cores: 'Processor cores',
          brand: 'Brand',
          color: 'Color',
          internal_storage_capacity: 'Internal storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/167_30375364',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '167',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '167',
      attributes: {
        sku: '167',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'HP Elite x2 1012 G1',
        description:
          'Mobility and style without compromise Strikingly thin and elegant, the Elite x2 1012 is a 2 in 1 for the mobile workforce and executives who want no compromises when it comes to enterprise-class power, durability, optional LTE connectivity4 and productivity on the go, in a stylish design. Stunning IT friendly design. Elite x2 1012 incorporates Elite global enterprise-class security and manageability features, enterprise-class durability, on-site serviceability,2 global sku availability and support across 180 countries. At your desk or on the road, meet the specific needs of your work day with the included HP Active Pen with App Launch that uses Wacom technology. Accessorize to boost your efficiency. Add optional enterprise docking solutions3 and advanced keyboards.',
        attributes: {
          thermal_design_power: '4.5 W',
          stepping: 'D1',
          processor_cores: '2',
          brand: 'HP',
          color: 'Silver',
        },
        superAttributesDefinition: ['color'],
        superAttributes: {
          internal_storage_capacity: ['512 GB', '256 GB'],
        },
        attributeMap: {
          super_attributes: {
            internal_storage_capacity: ['512 GB', '256 GB'],
          },
          product_concrete_ids: ['167_30375366', '167_30375364'],
          attribute_variants: [],
          attribute_variant_map: {
            '238': {
              internal_storage_capacity: '512 GB',
            },
            '239': {
              internal_storage_capacity: '256 GB',
            },
          },
        },
        metaTitle: 'HP Elite x2 1012 G1',
        metaKeywords: 'HP,Communication Electronics',
        metaDescription:
          'Mobility and style without compromise Strikingly thin and elegant, the Elite x2 1012 is a 2 in 1 for the mobile workforce and executives who want no compro',
        attributeNames: {
          thermal_design_power: 'Thermal Design Power (TDP)',
          stepping: 'Stepping',
          processor_cores: 'Processor cores',
          brand: 'Brand',
          color: 'Color',
          internal_storage_capacity: 'Internal storage capacity',
        },
        url: '/en/hp-elite-x2-1012-g1-167',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/167',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '167_30375366',
            },
            {
              type: 'concrete-products',
              id: '167_30375364',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '168_29379693',
      attributes: {
        sku: '168_29379693',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '168',
        name: 'HP ElitePad 1000 G2',
        description:
          'Powerful productivity. Take the next step in productivity with the HP ElitePad 1000 G2 Tablet equipped with a 64-bit Intel® processor and the features you need to stay productive in the office or on the go. Control wireless connection, including optional worldwide 4G LTE,1 with HP Connection Manager. Dual cameras help you collaborate or capture the moment. Work the way that suits you best. The ElitePad 1000 G2 supports touch, pen or voice-based input. More than a tablet—a total business solution. The elegant and sleek HP ElitePad 1000 G2 has the performance and flexibility to transform the way you work. Redefine productivity and stay light with the confidence of the leading manageability, security, and support you expect from HP.',
        attributes: {
          storage_media: 'SSD',
          processor_cores: '4',
          graphics_adapter: 'HD Graphics',
          processor_frequency: '1.6 GHz',
          brand: 'HP',
          internal_storage_capacity: '128 GB',
        },
        superAttributesDefinition: [
          'storage_media',
          'processor_frequency',
          'internal_storage_capacity',
        ],
        metaTitle: 'HP ElitePad 1000 G2',
        metaKeywords: 'HP,Communication Electronics',
        metaDescription:
          'Powerful productivity. Take the next step in productivity with the HP ElitePad 1000 G2 Tablet equipped with a 64-bit Intel® processor and the features you',
        attributeNames: {
          storage_media: 'Storage media',
          processor_cores: 'Processor cores',
          graphics_adapter: 'Graphics adapter',
          processor_frequency: 'Processor frequency',
          brand: 'Brand',
          internal_storage_capacity: 'Internal storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/168_29379693',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '168',
            },
          ],
        },
      },
    },
    {
      type: 'concrete-products',
      id: '168_21844742',
      attributes: {
        sku: '168_21844742',
        isDiscontinued: false,
        discontinuedNote: null,
        averageRating: null,
        reviewCount: 0,
        productAbstractSku: '168',
        name: 'HP ElitePad 1000 G2',
        description:
          'Powerful productivity. Take the next step in productivity with the HP ElitePad 1000 G2 Tablet equipped with a 64-bit Intel® processor and the features you need to stay productive in the office or on the go. Control wireless connection, including optional worldwide 4G LTE,1 with HP Connection Manager. Dual cameras help you collaborate or capture the moment. Work the way that suits you best. The ElitePad 1000 G2 supports touch, pen or voice-based input. More than a tablet—a total business solution. The elegant and sleek HP ElitePad 1000 G2 has the performance and flexibility to transform the way you work. Redefine productivity and stay light with the confidence of the leading manageability, security, and support you expect from HP.',
        attributes: {
          storage_media: 'SSD',
          processor_cores: '4',
          graphics_adapter: 'HD Graphics',
          processor_frequency: '1.6 GHz',
          brand: 'HP',
          internal_storage_capacity: '64 GB',
        },
        superAttributesDefinition: [
          'storage_media',
          'processor_frequency',
          'internal_storage_capacity',
        ],
        metaTitle: 'HP ElitePad 1000 G2',
        metaKeywords: 'HP,Communication Electronics',
        metaDescription:
          'Powerful productivity. Take the next step in productivity with the HP ElitePad 1000 G2 Tablet equipped with a 64-bit Intel® processor and the features you',
        attributeNames: {
          storage_media: 'Storage media',
          processor_cores: 'Processor cores',
          graphics_adapter: 'Graphics adapter',
          processor_frequency: 'Processor frequency',
          brand: 'Brand',
          internal_storage_capacity: 'Internal storage capacity',
        },
        productConfigurationInstance: null,
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/concrete-products/168_21844742',
      },
      relationships: {
        'abstract-products': {
          data: [
            {
              type: 'abstract-products',
              id: '168',
            },
          ],
        },
      },
    },
    {
      type: 'abstract-products',
      id: '168',
      attributes: {
        sku: '168',
        merchantReference: null,
        averageRating: null,
        reviewCount: 0,
        name: 'HP ElitePad 1000 G2',
        description:
          'Powerful productivity. Take the next step in productivity with the HP ElitePad 1000 G2 Tablet equipped with a 64-bit Intel® processor and the features you need to stay productive in the office or on the go. Control wireless connection, including optional worldwide 4G LTE,1 with HP Connection Manager. Dual cameras help you collaborate or capture the moment. Work the way that suits you best. The ElitePad 1000 G2 supports touch, pen or voice-based input. More than a tablet—a total business solution. The elegant and sleek HP ElitePad 1000 G2 has the performance and flexibility to transform the way you work. Redefine productivity and stay light with the confidence of the leading manageability, security, and support you expect from HP.',
        attributes: {
          storage_media: 'SSD',
          processor_cores: '4',
          graphics_adapter: 'HD Graphics',
          processor_frequency: '1.6 GHz',
          brand: 'HP',
        },
        superAttributesDefinition: ['storage_media', 'processor_frequency'],
        superAttributes: {
          internal_storage_capacity: ['128 GB', '64 GB'],
        },
        attributeMap: {
          super_attributes: {
            internal_storage_capacity: ['128 GB', '64 GB'],
          },
          product_concrete_ids: ['168_29379693', '168_21844742'],
          attribute_variants: [],
          attribute_variant_map: {
            '240': {
              internal_storage_capacity: '128 GB',
            },
            '241': {
              internal_storage_capacity: '64 GB',
            },
          },
        },
        metaTitle: 'HP ElitePad 1000 G2',
        metaKeywords: 'HP,Communication Electronics',
        metaDescription:
          'Powerful productivity. Take the next step in productivity with the HP ElitePad 1000 G2 Tablet equipped with a 64-bit Intel® processor and the features you',
        attributeNames: {
          storage_media: 'Storage media',
          processor_cores: 'Processor cores',
          graphics_adapter: 'Graphics adapter',
          processor_frequency: 'Processor frequency',
          brand: 'Brand',
          internal_storage_capacity: 'Internal storage capacity',
        },
        url: '/en/hp-elitepad-1000-g2-168',
      },
      links: {
        self: 'http://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/168',
      },
      relationships: {
        'concrete-products': {
          data: [
            {
              type: 'concrete-products',
              id: '168_29379693',
            },
            {
              type: 'concrete-products',
              id: '168_21844742',
            },
          ],
        },
      },
    },
  ],
};
