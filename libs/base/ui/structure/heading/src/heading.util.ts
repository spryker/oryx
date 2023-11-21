import { Size } from '@spryker-oryx/utilities';
import { TemplateResult } from 'lit';
import { HeadingDirectiveOptions, HeadingTypography } from './heading.model';

/**
 * Utility function to render a heading.
 */
export const renderHeading = (
  content?: string | TemplateResult,
  options?: HeadingDirectiveOptions,
  attributes?: string
): string => {
  const { tag } = options ?? {};
  const style = getHeaderStyles(options, extractStyleAttributes(attributes));
  let tagName: string;

  switch (tag) {
    case (HeadingTypography.Caption,
    HeadingTypography.Small,
    HeadingTypography.Subtitle,
    HeadingTypography.SubtitleSmall):
      tagName = 'span';
      break;
    case HeadingTypography.Bold:
      tagName = 'b';
      break;
    default:
      tagName = tag ?? 'span';
  }

  return `<${tagName} style="${style}" ${
    extractNonStyleAttributes(attributes) ?? ''
  }>${content}</${tagName}>`;
};

const styleRegex = /style="([^"]*)"/;
function extractStyleAttributes(attributes = ''): string | undefined {
  let match = attributes.match(styleRegex)?.[1];
  if (match && !match.endsWith(';')) match += ';';
  return match ? match : undefined;
}

function extractNonStyleAttributes(htmlString = ''): string | undefined {
  const nonStyleAttributes = htmlString.replace(styleRegex, '');
  return nonStyleAttributes ? nonStyleAttributes.trim() : undefined;
}

const getHeaderStyles = (
  options?: HeadingDirectiveOptions,
  existingStyles = ''
): string | undefined => {
  if (!options) return;

  const lg = options?.lg ? getHeaderStyle(options.lg, Size.Lg) : '';
  const md = options?.md ? getHeaderStyle(options.md, Size.Md) : '';
  const sm = options?.sm ? getHeaderStyle(options.sm, Size.Sm) : '';
  const style = getHeaderStyle(options.typography ?? options.tag);
  const lines = options.maxLines ? `--line-clamp:${options.maxLines};` : '';
  if (!style && !lg && !md && !sm && !lines) return;
  return `${style}${lg}${md}${sm}${lines}${existingStyles}`;
};

const getHeaderStyle = (tag?: string, size?: Size): string => {
  if (!tag) return '';
  const screen = size ? `-${size}` : '';

  const fontSize = `--_fs${screen}:var(--oryx-typography-${tag}-size)`;
  const fontWeight = `--_fw${screen}:var(--oryx-typography-${tag}-weight)`;
  const lineHeight = `--_lh${screen}:var(--oryx-typography-${tag}-line)`;

  return `${fontSize};${fontWeight};${lineHeight};`;
};
