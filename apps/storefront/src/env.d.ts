/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CONTENT_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
