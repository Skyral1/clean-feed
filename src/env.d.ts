/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // biome-ignore lint/suspicious/noExplicitAny: generic component declaration
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
