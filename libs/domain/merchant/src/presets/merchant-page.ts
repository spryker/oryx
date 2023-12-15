import { ExperienceComponent } from '@spryker-oryx/experience';

export const merchantPage: ExperienceComponent = {
  id: 'merchant-page-content',
  type: 'oryx-composition',
  options: {
    rules: [{ layout: { type: 'split', columnWidthType: 'main' } }],
  },
  components: [
    {},
    {
      type: 'oryx-merchant-opening-hours',
    },
  ],
};

// get from merchant package
// {
//     type: 'oryx-composition',

//     components: [
//       {
//         type: 'oryx-site-breadcrumb',
//         options: {
//           rules: [
//             {
//               colSpan: 2,
//             },
//             { query: { breakpoint: Size.Sm }, hide: true },
//           ],
//         },
//       },

//       {
//         type: 'oryx-merchant-banner',
//         options: {
//           rules: [
//             { colSpan: 2, height: '250px', objectFit: ObjectFit.Cover },
//           ],
//         },
//       },

//       {
//         type: 'oryx-entity-text',
//         options: {
//           entity: 'Merchant',
//           field: 'banner',
//           rules: [
//             { colSpan: 2, height: '250px', objectFit: ObjectFit.Cover },
//           ],
//         },
//       },

//       {
//         type: 'oryx-composition',
//         components: [
//           {
//             type: 'oryx-merchant-title',
//             options: {
//               rules: [{ typography: HeadingTag.H1 }],
//               prefix: null,
//               link: false,
//             },
//           },
//           { type: 'oryx-merchant-legal' },
//           { type: 'oryx-merchant-description' },
//         ],
//         options: {
//           rules: [{ layout: 'list' }],
//         },
//       },

//       {
//         type: 'oryx-composition',
//         components: [
//           {
//             type: 'oryx-merchant-logo',
//             options: { rules: [{ width: '100px' }] },
//           },
//           { type: 'oryx-merchant-openings-hours' },
//           { type: 'oryx-merchant-contact' },
//         ],
//         options: {
//           rules: [{ layout: 'list' }],
//         },
//       },
//     ],
//   },
