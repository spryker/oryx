# Theme

In order for reusing components per application flexible design system in needed. Theme provides ability to encapsulate custom styling into themes which can be changed/extended per application.
The color system is driven by design tokens. Icons are changeable.
While `Oryx` can have a standard dimensions on the definition of breakpoints, it is common for customers (and their design systems). Theme allows flexibility to support alternative screen sizes and the associated breakpoints.
All these options can be configured by theme.

## Theme Configuration

Theme configuration allows defining:

- components styles;
- breakpoints values;
- icons;
- design tokens;

### Components

Required property. Uses for connecting styles with component by component name (defined in the component definition). It allows use lazy loaded function of styles which return `ThemeStyles` or plain `ThemeStyles`.

```ts
const theme: Theme = {
  components: {
    'oryx-component-a': {
      styles: '',
    },
    'oryx-component-b': () => import('path/to/component.styles').then((c) => c.styles),
  },
};
```

ThemeStyles has different variant of styles definition:

```ts
const styles: ThemeStyles = {
  styles: css`` | [css``, css``] | ``;
}

/// or by breakpoints

const styles: ThemeStyles = {
  styles: [
    css``,
    ``,
    {
      media: {
        [ThemeDefaultMedias.Screen]: Size.Sm
      }
      styles: css`` | [css``, css``] | ``;
    },
    {
      media: {
        // Custom (should be augmented first see breakpoints block)
        [ThemeDefaultMedias.Screen]: 'custom'
      }
      styles: css`` | [css``, css``] | ``;
    }
  ]
}
```

It is possible to define strategy for styles which will describe styles merging. By default all the styles defined in multiple themes for one component will be merged together.

`ThemeStrategies.Replace` will replace all previous themes with same component.
`ThemeStrategies.ReplaceAll` will replace all previous themes with same component and also replace `base` component styles.

```ts
const styles: ThemeStyles = {
  styles: css`` | [css``, css``] | ``;
  strategy: ThemeStrategies.Replace
}
```

### Icons

Defines svg icons. It allows use lazy loaded function which return string or plain string. It uses override strategy so icon with the same name will override icon from previous theme.

```ts
const theme: Theme = {
  icons: {
    'oryx-icon-a': () => import('path/to/icon').then((s) => s.icon),
    'oryx-icon-b': '<svg>....</svg>',
  },
};
```

### Design Tokens

Creates css variables by design token system. It allows use lazy loaded function which return `DesignToken[]` or plain `DesignToken[]`. Tokens will be applied to the root (`:host {...}`) component if defined root component is `LitComponent` or will prepend `styles` tag to the `body` with stylesheet (`:root {...}`);

```ts
const theme: Theme = {
  designTokens: () => import('path/to/design-tokens').then((s) => s.tokens),
  /// or
  designTokens: {
    'token-a': 'value',
  },
};
```

Tokens are array of any nested level objects (except colors) which will be generated into `--oryx-path-to-string-value: value` variable. It allows also defining variables by media (dark mode or screen size);

```ts
const tokens: DesignToken[] = [
  {
    color: {
      brand: '#17b997'
      // or with shades [100-500]
      ink: {
        100: '#17c497',
        200: '#17b997',
        300: '#17b997',
        400: '#17b486',
        500: '#17b476',
      }
    },
    long: {
      nested: {
        object: 'value',
      },
    }
    'margin-a': '10px',
  }
  {
    media: {
      mode: dark,
    },
    color: {
      brand: 'orange',
    },
  },
  {
    media: {
      // Depends on breakpoints configuration
      [ThemeDefaultMedias.Screen]: Size.Md,
    },
    'margin-a': '100px',
  },
]
```

Design tokens overrides each other by the following theme. So it renders stylesheet without duplications.

### Breakpoints

Defines breakpoints values. It is possible to define min and max value for each breakpoint. By default breakpoints use mobile first approach so they will be sorted by min value. Breakpoints are global and they are shallow merged between themes.

```ts
const theme: Theme = {
  breakpoints: {
    [Size.Sm]: {
      min: 0,
      max: 568,
    },
    [Size.Md]: {
      min: 768,
    },
    [Size.Lg]: {
      min: 1024,
    },
  },
};
```

For using custom breakpoint keys `ThemeBreakpoints` should be augmented first.

```ts
declare module '@spryker-oryx/core' {
  export interface ThemeBreakpoints {
    custom?: ScreenSize;
  }
}

const theme: Theme = {
  breakpoints: {
    custom: {
      min: 444,
      max: 888,
    },
  },
};
```
