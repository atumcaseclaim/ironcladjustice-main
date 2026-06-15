# Iron Clad Justice — Design Change & Deployment Runbook
# How to make changes safely and deploy them live

---

## Overview

All ICJ pages are deployed via GitHub → Vercel auto-deploy. Pushing to `main` on `atumcaseclaim/ironcladjustice-main` triggers a rebuild of the single `ironcladjustice-hub` Vercel project, which serves all subdomains via Edge Middleware. No manual redeploy needed.

**Local repo location:** `$ICJ_WORKSPACE/` (`~/projects/atum/icj/ironcladjustice-main/`)

| Subfolder | Live Domain |
|-----------|-------------|
| `www/` | ironcladjustice.com |
| `talcum/` | talcum.ironcladjustice.com |
| `hair/` | hair.ironcladjustice.com |
| `depo/` | depo.ironcladjustice.com |
| `afff/` | afff.ironcladjustice.com |
| `wildfire/` | wildfire.ironcladjustice.com |
| `roblox/` | roblox.ironcladjustice.com |
| `camp-lejeune/` | camp-lejeune.ironcladjustice.com |
| `sma/` | sma.ironcladjustice.com |
| `privacy/` | privacy.ironcladjustice.com |
| `terms/` | terms.ironcladjustice.com |

---

## Part 1 — Before Making Any Change

### 1.1 Check if the element is frozen

Open `TEMPLATE_RULES.md` and look up the element you want to change.

**Frozen elements** (require explicit approval before touching):
- Header HTML structure and CSS
- Form action URL
- TrackDrive hidden field values
- TrustedForm script
- IP geolocation scripts
- TCPA legal text
- Submit button text
- Footer HTML
- Disclaimer text

**Safe to change** (editorial/content changes):
- Right-column paragraph text
- Attention box subheading text
- Case image
- Page title / meta description
- Injury dropdown options (if approved by campaign manager)
- Additional qualifying questions (with campaign manager sign-off)

### 1.2 If frozen — get approval first

Do not proceed without explicit confirmation from the account owner. Document the approval before making the change.

---

## Part 2 — Making the Change

### 2.1 Edit the file

All files are plain HTML. Open in any text editor.

```bash
# Example: editing the talcum page
open $ICJ_WORKSPACE/talcum/index.html
```

Or use Claude Code for guided edits.

### 2.2 Applying a change to multiple pages

If a design change needs to go across all case pages (e.g., updating the attention box style), make the change to each page individually and verify each one:

1. `talcum/index.html`
2. `hair/index.html`
3. `depo/index.html`
4. `afff/index.html`, `wildfire/index.html`, `roblox/index.html`, etc.
5. Any new case pages

Use grep to confirm consistency:
```bash
# Example: verify all pages have the correct red left border
grep -r "border-left:6px solid #dc2626" $ICJ_WORKSPACE/
```

### 2.3 Validate before deploying

Open the file in a browser and check:
- [ ] Change looks correct
- [ ] Header intact: logo + CTA, no nav links
- [ ] Attention box: white bg, red left border
- [ ] Form still present and all fields visible
- [ ] No broken layout from the change
- [ ] Footer links intact

---

## Part 3 — Deploying the Change

### 3.1 Deploy a single page

```bash
cd $ICJ_WORKSPACE

git add [case]/index.html
git commit -m "Design: [brief description of what changed]"
git push origin main
```

Vercel detects the push and auto-deploys `ironcladjustice-hub`. Build typically completes in 30–60 seconds.

**Commit message conventions:**
- `Design: [description]` — visual/layout changes
- `Content: [description]` — text/copy changes
- `Fix: [description]` — correcting a bug or broken element
- `Launch: [description]` — new page or feature going live

### 3.2 Deploy changes to multiple pages

Deploy each page in sequence. Wait for each to confirm before moving to the next.

```bash
cd $ICJ_WORKSPACE

git add talcum/index.html hair/index.html depo/index.html
git commit -m "Design: [description]"
git push origin main
```

One push deploys all changes simultaneously via `ironcladjustice-hub`.

### 3.3 Verify the live site

Check the live URL ~60 seconds after pushing. Hard-refresh (Cmd+Shift+R / Ctrl+Shift+R) to bypass browser cache.

```
https://talcum.ironcladjustice.com
https://hair.ironcladjustice.com
https://depo.ironcladjustice.com
```

If the change isn't live after 2 minutes:
1. Check https://vercel.com/dashboard → project `ironcladjustice-hub`
2. Deployments tab → look for errors in the latest deployment
3. Check Build Logs if build failed

---

## Part 4 — Troubleshooting

### Build failed on Vercel

Since all pages are static HTML (no build step), build failures are rare. Most common causes:
- File encoding issue (save as UTF-8)
- Syntax error in a `<script>` block
- Vercel project disconnected from GitHub (check `ironcladjustice-hub` → Settings → Git in Vercel dashboard)

### Change not appearing live

1. Hard refresh the page (bypass cache)
2. Check that `git push` succeeded without errors
3. Check Vercel deployment status — look for the latest deploy with a green checkmark
4. If domain shows "No Deployment": in Vercel, go to project → Settings → Domains → click domain → assign latest deployment

### Domain showing wrong content

The domain may be assigned to the wrong Vercel project. This happened during the initial ICJ deployment (domains were still assigned to old CaseClaimNetwork projects).

**Diagnose:**
```bash
export VERCEL_TOKEN="vcp_YOUR_TOKEN"
export DOMAIN="talcum.ironcladjustice.com"

# Check which project owns the domain
curl -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/domains/${DOMAIN}/config"
```

**Fix — migrate domain to hub:**
```bash
export OLD_PROJECT="old-project-name"

# Step 1: Remove from old project
curl -X DELETE \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/projects/${OLD_PROJECT}/domains/${DOMAIN}"

# Step 2: Add to ironcladjustice-hub
curl -X POST \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  "https://api.vercel.com/v9/projects/ironcladjustice-hub/domains" \
  -d "{\"name\": \"${DOMAIN}\"}"
```

### Form not submitting / leads not appearing

1. Verify `<form action="https://atum-legal.trackdrive.com/api/v1/leads" method="POST">` is intact
2. Verify `lead_token` hidden field has the correct value for this page (see TEMPLATE_RULES.md)
3. Verify TrustedForm script is present before `</body>`
4. Check browser network tab on submit — look for a POST request to trackdrive.com

---

## Part 5 — Known Per-Page Quirks

These differences are intentional and match the live sites. Do not "fix" them.

| Page | Quirk |
|------|-------|
| **Hair** | IP/TrustedForm hidden fields use dot-notation: `name="data.ip_address"` and `name="data.trusted_form_cert_url"`. Not a bug — matches live hair page. |
| **Hair** | No form submit redirect script. Talcum has one; hair doesn't. Matches live. |
| **Depo** | No TrackDrive configuration. Form is a UI placeholder only. Matches live depo page. Do not add TrackDrive fields without a new lead_token from campaign manager. |
| **Depo** | Footer links use `ironcladjustice.com` (not `altrck4.com`) for privacy/terms. Matches live. |
| **Talcum** | Has a post-submit redirect to `https://thankyou.caseclaimnetwork.com/`. Matches live. |

---

## Part 6 — Homepage Case Links

The homepage (`www.ironcladjustice.com`) links to each case subdomain. If you add a new case page, you must also update the homepage.

Homepage file: `$ICJ_WORKSPACE/index.html`

All case links should point to:
- `https://talcum.ironcladjustice.com`
- `https://hair.ironcladjustice.com`
- `https://depo.ironcladjustice.com`
- `https://[newcase].ironcladjustice.com`

**NEVER** link to old Vercel preview URLs (`.vercel.app`) or old `caseclaimnetwork.com` domains.

Verify homepage links:
```bash
grep -E "href=" $ICJ_WORKSPACE/index.html | grep -v "altrck4\|privacy\|terms\|#"
```

---

## Part 7 — Security Reminders

- Tokens are persistent in `projects/atum/.atum-credentials` — do NOT revoke between sessions (see OPERATIONS_SOP.md Phase 11)
- Never commit tokens to the repository
- Never store tokens in HTML files
- If a token must be rotated: update `.atum-credentials` immediately so the next session doesn't break
