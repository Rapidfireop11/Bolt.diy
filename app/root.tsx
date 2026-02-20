import { redirect, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useStore } from '@nanostores/react';
import type { LinksFunction } from '@remix-run/cloudflare';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import tailwindReset from '@unocss/reset/tailwind-compat.css?url';
import { themeStore } from './lib/stores/theme';
import { stripIndents } from './utils/stripIndent';
import { createHead } from 'remix-island';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ClientOnly } from 'remix-utils/client-only';
import { cssTransition, ToastContainer } from 'react-toastify';

import reactToastifyStyles from 'react-toastify/dist/ReactToastify.css?url';
import globalStyles from './styles/index.scss?url';
import xtermStyles from '@xterm/xterm/css/xterm.css?url';

import 'virtual:uno.css';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  
  // Allow login and admin pages to load without a code
  if (url.pathname === "/login" || url.pathname === "/admin") {
    return null;
  }

  const cookieHeader = request.headers.get("Cookie") || "";
  const userCode = cookieHeader.split('invite_code=')[1]?.split(';')[0];

  if (!userCode) {
    return redirect("/login");
  }

  // Check the Cloudflare KV Database
  const kv = (context.cloudflare as any).env.INVITE_KV;
  const dataString = await kv.get(userCode);
  
  if (!dataString) {
    return redirect("/login");
  }

  const data = JSON.parse(dataString);
  const now = Math.floor(Date.now() / 1000);

  // Check Expiration and Usage Limit
  if ((data.expires && now > data.expires) || (data.uses >= data.limit)) {
    return redirect("/login");
  }

  return null;
};

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
});

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'stylesheet', href: reactToastifyStyles },
  { rel: 'stylesheet', href: tailwindReset },
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: xtermStyles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
];

const inlineThemeCode = stripIndents`
  setTutorialKitTheme();
  function setTutorialKitTheme() {
    let theme = localStorage.getItem('bolt_theme');
    if (!theme) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }
`;

export const Head = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta />
    <Links />
    <script dangerouslySetInnerHTML={{ __html: inlineThemeCode }} />
  </>
));

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useStore(themeStore);
  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <ClientOnly>{() => <DndProvider backend={HTML5Backend}>{children}</DndProvider>}</ClientOnly>
      <ToastContainer position="bottom-right" transition={toastAnimation} autoClose={3000} />
      <ScrollRestoration />
      <Scripts />
    </>
  );
}

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
