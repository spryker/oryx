import { IconTypes } from '../../graphical/icon/src';

export interface Breadcrumb {
  label: string;
  url?: string;
}

export interface BreadcrumbsProperties {
  breadcrumbs?: Breadcrumb[];
  divider?: IconTypes;
}
