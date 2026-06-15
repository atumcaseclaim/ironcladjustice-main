# Iron Clad Justice — Project Context

## Brand Identity
- Domain: ironcladjustice.com
- Type: Multi-case personal injury lead gen
- Audience: PI claimants (mass tort, environmental, product liability)

## Tech Stack
- Vanilla HTML / CSS / JS (no framework)
- Multi-subdomain monorepo structure
- Each case = subdirectory with its own index.html

## Active Cases (subfolders)
| Folder | Subdomain | Case Type |
|--------|-----------|-----------|
| www | ironcladjustice.com | Main hub |
| wildfire | wildfire.ironcladjustice.com | Wildfire litigation |
| talcum | talcum.ironcladjustice.com | Talcum powder |
| hair | hair.ironcladjustice.com | Hair relaxer |
| depo | depo.ironcladjustice.com | Depo-Provera |
| camp-lejeune | camp-lejeune.ironcladjustice.com | Camp Lejeune |
| afff | afff.ironcladjustice.com | AFFF firefighting foam |
| sma | sma.ironcladjustice.com | SMA |
| privacy | ironcladjustice.com/privacy | Privacy policy |
| terms | ironcladjustice.com/terms | Terms of service |
| thankyou | — | Thank you page |

## Lead Flow
- Platform: TrackDrive (atum-legal.trackdrive.com)
- Each case has its own offer/lead_token created in the TrackDrive dashboard (e.g. sma, depo already have tokens set)
- Buyers: PI attorney aggregators, flat per-lead or rev-share

## Archived Repos (DO NOT CLONE — do not modify)
ironcladlegal, ironcladjustice-talcum, ironcladjustice-hair, ironcladjustice-depo,
ironcladjustice-privacy, ironcladjustice-terms — all superseded by ironcladjustice-main

## Credentials
All persistent tokens (ATUM_GITHUB_TOKEN, VERCEL_TOKEN, TD_TOKEN/TD_BASE, NC_USER/NC_KEY/NC_IP) live in the shared `projects/atum/.atum-credentials` (gitignored, source it: `source ../../.atum-credentials`). Read from there first. Only ask Rich if a value is blank — then write it back to `.atum-credentials` so it's never asked again. Do NOT revoke these between workflow runs (see OPERATIONS_SOP.md Phase 11).

## Vercel Architecture (hub model — updated 2026-06-15)
- Single project: `ironcladjustice-hub` serves ALL subdomains
- Routing: `middleware.js` at repo root inspects Host header → rewrites to correct subfolder
- Adding a new case requires: (1) add entry to `SUBDOMAIN_MAP` in `middleware.js`, (2) `POST` domain to `ironcladjustice-hub`, (3) DNS CNAME via Namecheap
- Do NOT create per-case Vercel projects — the repo is at 1/10 linked projects; creating new ones wastes slots
- Image paths must be relative (`./images/foo.jpg`), never root-relative (`/images/foo.jpg`)

## Hard Rules
- ZERO connection to SSDI, CCN, or any other Atum vertical — never reference, link, or share code
- NEVER modify archived repos
- After every `git push origin main`: dispatch background subagent to verify Vercel READY state + live content on affected domain(s)
- GitHub token: use `ATUM_GITHUB_TOKEN` from env

## Dev Server
See `.claude/launch.json` — each case subdomain runs on its own port (3000–3006).
Run: `npx serve [folder] -p [port]`
