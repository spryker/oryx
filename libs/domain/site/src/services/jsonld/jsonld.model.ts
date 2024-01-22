export interface JSONLD {
  '@context'?: string;
  '@type': string;
  [key: string]:
    | string
    | number
    | boolean
    | JSONLD
    | (string | number | boolean | JSONLD)[]
    | undefined;
}
