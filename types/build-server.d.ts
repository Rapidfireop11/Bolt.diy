// Provide a minimal declaration so TypeScript stops complaining about the dynamic import
// of the generated Remix server build. The actual types come from Remix and are applied
// at runtime via the `ServerBuild` interface.

declare module '../build/server' {
  import type { ServerBuild } from '@remix-run/cloudflare';
  const build: ServerBuild;
  export default build;
}
