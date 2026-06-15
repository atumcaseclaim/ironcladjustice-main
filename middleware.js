import { rewrite } from '@vercel/edge';

export const config = { matcher: '/:path*' };

const SUBDOMAIN_MAP = {
  'afff': 'afff',
  'depo': 'depo',
  'hair': 'hair',
  'wildfire': 'wildfire',
  'talcum': 'talcum',
  'sma': 'sma',
  'roblox': 'roblox',
  'camp-lejeune': 'camp-lejeune',
  'privacy': 'privacy',
  'terms': 'terms',
  'thankyou': 'thankyou',
  'www': 'www',
};

export default function middleware(req) {
  const url = new URL(req.url);
  const host = req.headers.get('host') ?? '';

  // Extract subdomain: "afff.ironcladjustice.com" → "afff"
  // Apex "ironcladjustice.com" or "www.ironcladjustice.com" → "www"
  const hostBase = host.replace(/:\d+$/, '');
  const parts = hostBase.split('.');
  const subdomain = parts.length >= 3 ? parts[0] : 'www';
  const folder = SUBDOMAIN_MAP[subdomain] ?? 'www';

  // Already prefixed — pass through
  if (url.pathname.startsWith(`/${folder}/`)) {
    return;
  }

  // Transparent rewrite — URL bar unchanged
  const rewritePath = url.pathname === '/' || url.pathname === ''
    ? `/${folder}/index.html`
    : `/${folder}${url.pathname}`;

  url.pathname = rewritePath;
  return rewrite(url);
}
