/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly FES_CONTENT_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
