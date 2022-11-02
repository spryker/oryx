# Product images

## Background

Product images are shown in various places throughout the experience. Small icon-sized images appear in the typeahead search results and start to increase in size while you navigate to the listing page and detail page. Some products might even require a full screen image or an image that can be used to zoom in to provide the right level of visual detail.

A single product image is typically transformed to different sizes to allow for such a "responsive" setup. When the product is shown from different angles, multiple images are used. These images are represented in a so-called _image sets_.

## Images and other media

While most products are exposed by pictures, there are other visuals that can be used. E.g. videos, documents, 3d-images, vector images, etc. While the core Spryker data model was designed around images, the client side data model has been abstracted away from images perse, so that other media can be supported more easily.

## Optimized experiences for each user

Since users have different devices, network connections and screen sizes, images can be optimised for each specific case. This will provide a balanced setup between high quality image and performance. The various optimisation factors to take into account are:

- Pixel density – the pixel density varies per device. Modern devices start to support more pixel density so that higher resolution images can be rendered. Higher resolution images, however, require more time to download.
- Fast vs slow connection. 4g or 5g connections are considered fast, where as 3g or slower are considered slow. Users with slow connections are not served well with high resolution images, even though their devices might support higher pixel densities.

The screen size does not really matter for product images, since product images are typically constraint in a container layout. The container size will define the image size rather than the screen size. The exception here might be full sized images that are used to render the image fullscreen.

**Note**: all these quality factors are not known server side. At server side we could take a conservative approach to quality, to improve the initial server side rendered page loa (for crawlers we'd still provide a high resolution image though using different techniques).

## Configuration options

There are various entities involved in the image setup:

- `Size`
- `ProductMediaContainerSize`
- `MediaContext`
- `ProductMediaConfig`

### Size

The `Size` enum contains t-shirt size values that are used to identify the media size without being too constraint about the exact pixel size. While the size comes in a range from `Xs` to `Xl`, Spryker only provides images in `Sm` and `Lg`. This is fine, as the sizes can be mapped to the so-called _container size_. Moreover, the model allows for customisations, either in the backend or by integrating 3rd party services.

### `ProductMediaContainerSize`

Each media can be used in different components. The source size has been decoupled from the usage, so that multiple sizes can be mapped to the container size. The `ProductMediaContainerSize` enum comes with four values:
| Size | Usage |
| --- | --- |
| `Icon` | Typeahead search response |
| `Thumbnail` | Product lists, cart entry, wishlist, etc. |
| `Detail` | Detailed media on the product detail page |
| `Full` | Fullscreen or zoomed variation on the product detail page |

### `MediaContext`

The media context can be used to specify quality constraints for a certain media. This allows for optimised experiences, based on the user device and connection speed.

Breakpoints are explicitly not part of the context, since they do not contribute to the selection of product media. Product media are typically constraint by the layout, not by the screen size.

### `ProductMediaConfig`

A container size can be mapped to multiple sizes, using different contexts. The following example illustrates two sources being mapped to the icon format. The `Xs` size is used for any device, where as the `Sm` size variation is used for users with high density devices on a high connections.

```ts
export const productMediaConfig: ProductMediaConfig = {
  icon: {
    sizes: [
      { size: Size.Xs },
      {
        context: {
          density: 2,
          connection: 'fast',
        },
        size: Size.Sm,
      },
    ],
  },
};
```
