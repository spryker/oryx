import { TemplateResult } from 'lit';

export const IconHookToken = 'FES.IconHookToken';

export type IconHookToken = (
  type?: string,
  spriteUrl?: string
) => TemplateResult;

declare global {
  interface HooksTokenMap {
    [IconHookToken]: IconHookToken;
  }
}
