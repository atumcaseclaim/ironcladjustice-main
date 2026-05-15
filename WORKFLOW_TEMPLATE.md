# Iron Clad Justice — Case Launch Workflow Template
# Agnostic, repeatable process for any new mass tort case

Last Updated: 2026-05-14

---

## Required Inputs Checklist

Collect ALL of the following before starting. Missing any item = work does not begin.

### From You (Rich)
- [ ] **Law firm spec doc** — qualifying criteria, damage types, injury types, usage requirements, time period, disqualifiers
- [ ] **Case name** — human-readable (e.g., "CA Wildfire Claims", "Roundup Herbicide")
- [ ] **Subdomain slug** — lowercase, hyphen-separated (e.g., `wildfire`, `roundup`)
- [ ] **Buyer spec doc** — endpoint URL, auth method (API key, Bearer, etc.), required field names, accepted values, response format (what does acceptance look like?)
- [ ] **Image** — optional; if not provided I source 2-3 candidates from Unsplash/Pexels for your approval
- [ ] **TrackDrive Developer Token** — from TrackDrive account → Developer Tokens
- [ ] **GitHub PAT** — `repo` scope; revoke immediately after push confirms
- [ ] **Vercel API Token** — Full Account scope; revoke after DNS resolves
- [ ] **Namecheap API Key** — `atumlegal` account; VPN must be active when calling API
- [ ] **VPN confirmed active** — check IP starts with `136.242.` before any Namecheap call

### From Buyer
- [ ] Buyer posting spec / integration doc
- [ ] Confirmation that compliance review is complete before go-live
- [ ] Test lead approval before opening live traffic

---

## Phase 1 — TrackDrive Offer Setup

**Goal:** Create offer, add all contact fields, get `lead_token`.

### 1a. Check for existing offer
```bash
GET /api/v1/offers
# Search response for case name
# If found: note offer ID and lead_token, skip to 1c
```

### 1b. Create new offer
```bash
POST /api/v1/offers
# Flat JSON — no wrapper object
{
  "name": "[COMPANY_PREFIX] - [CASE_NAME]",
  "campaign_slug": "[case-slug]"
}
# → Returns offer.id and offer.lead_token
# NEVER include lead_token in HTML comments
```

### 1c. Add default contact fields (always first, every offer)
Run the default fields batch from `Form field template - default contact fields.csv`:
- first_name, last_name, email, phone, state, city, zip
- ip_address, source_url, xxtrustedformcerturl
- s1, s2, s3, s4

**Note:** `attorney` is in the default CSV. If it is also a case-specific qualifying field, the default definition takes precedence — do NOT add it again as a case-specific field. Instead, add the picklist values to the existing default `attorney` field.

### 1d. Add case-specific contact fields
Add only the qualifying/criteria fields the buyer requires for routing. Each field needs:
- `key` (snake_case, matches HTML form `name` attribute exactly)
- `name` (human-readable label)
- `value_type`: `string` for text/select, `boolean` for yes/no
- Picklist values if select type

**Rule:** Do not add fields that the law firm uses internally but the buyer does not require in the POST body.

### 1e. Retrieve posting instructions URL
```
https://[trackdrive-subdomain].trackdrive.com/offers/[offer_id]/posting_instructions
```
Send this URL to the traffic source.

---

## Phase 2 — Content Draft ⛔ APPROVAL GATE

**Goal:** Draft all copy for approval before writing a single line of HTML.

Deliver the following in chat for explicit approval:

1. **Page title** — `Iron Clad Justice - [Case Name]`
2. **Meta description** — 1 sentence, hedged language, ≤155 characters
3. **Attention subheading** — 1 sentence, punchy, ends with "!"
4. **Form questions** — label text + all dropdown option values (must match TrackDrive `contact_field_values` exactly)
5. **Editorial paragraphs** — 4–6 paragraphs following the content structure in OPERATIONS_SOP.md Section 6

**Hold.** Do not proceed until Rich responds with "approved" or "approved, with change: [...]"

### Content Rules (from OPERATIONS_SOP.md)
| Use | Avoid |
|-----|-------|
| "may be entitled to compensation" | "will receive a settlement" |
| "studies have shown" | "it is proven that" |
| "you may qualify" | "you qualify" |
| "alleged to" / "claims allege" | "causes" (as proven fact) |
| No specific dollar amounts | Ever |
| No guaranteed outcomes | Ever |
| No attorney or law firm names | Ever |

---

## Phase 3 — Image ⛔ APPROVAL GATE

**Goal:** Select a licensable image relevant to the case.

If image not provided by Rich:
1. Search Unsplash and Pexels for 2–3 candidates
2. Present each with: description, dimensions, license, direct URL
3. Hold until Rich selects one

**Hold.** Do not download or use any image until explicitly selected.

---

## Phase 4 — Landing Page Build

**Goal:** Complete HTML file with zero remaining placeholders.

1. Copy `CASE_TEMPLATE/index.html` → `ironcladjustice-[slug]/index.html`
2. Create `ironcladjustice-[slug]/images/` and place image as `[slug].jpg`
3. Replace all `[BRACKET]` placeholders:

| Placeholder | Value |
|-------------|-------|
| `[PAGE_TITLE]` | Approved page title |
| `[META_DESCRIPTION]` | Approved meta description |
| `[LEAD_TOKEN]` | From TrackDrive offer (never in comments) |
| `[CASE_SLUG]` | TrackDrive campaign slug |
| `[PRODUCT_QUESTION]` | First qualifying question label |
| `[INJURY_OPTIONS]` | All qualifying `<select>` blocks (full HTML) |
| `[ATTENTION_SUBHEADING]` | Approved attention subheading |
| `[CONTENT_PARAGRAPHS]` | Approved editorial paragraphs in `<p>` tags |
| `[CASE_IMAGE_FILENAME]` | e.g., `wildfire.jpg` |
| `[CASE_NAME]` | Human-readable case name |

4. Grep check — zero unresolved placeholders:
```bash
grep -n "\[" index.html | grep -v "<!--\|//\|focus:\|hover:\|border-\[" 
# Must return only JS/CSS syntax hits, no [BRACKET] strings
```

5. **Frozen elements** — confirm these are untouched (see TEMPLATE_RULES.md):
   - Header HTML + CSS
   - Form action URL
   - TrustedForm script
   - IP geolocation scripts
   - TCPA legal text
   - Submit button text
   - Footer HTML
   - Disclaimer text

---

## Phase 5 — GitHub (Monorepo)

**Structure:** All cases live in `atumcaseclaim/ironcladjustice-main`. No new repo per case.

```bash
GITHUB_TOKEN="[PAT]"
BASE="/Users/richconnelly/Desktop/CLAUDE WORKSPACE/ironcladjustice-deploy"

# Create new subdirectory for the case
mkdir -p "${BASE}/[slug]/images"

# Copy built index.html and any images into the subdirectory
cp [built-index.html] "${BASE}/[slug]/index.html"
cp [image.jpg] "${BASE}/[slug]/images/[slug].jpg"   # if applicable

# Stage and push
cd "${BASE}"
git add [slug]/
git commit -m "Add [Case Name] landing page"
git push origin main

# Confirm at: https://github.com/atumcaseclaim/ironcladjustice-main/tree/main/[slug]
```

**Note:** No GitHub PAT needed for this step since the repo already exists locally with a remote configured.

---

## Phase 6 — Vercel (Monorepo)

```bash
VERCEL_TOKEN="[token]"
TEAM_ID="team_gUqkzG8sqjxTcnuOcXDAEM3L"

# Create project linked to monorepo with rootDirectory
POST https://api.vercel.com/v9/projects?teamId=[TEAM_ID]
{
  "name": "ironcladjustice-[slug]",
  "framework": null,
  "rootDirectory": "[slug]",
  "gitRepository": { "type": "github", "repo": "atumcaseclaim/ironcladjustice-main" }
}
# → Returns project.id

# Add domain
POST https://api.vercel.com/v9/projects/[PROJECT_ID]/domains?teamId=[TEAM_ID]
{ "name": "[slug].ironcladjustice.com" }

# Trigger first deployment
# 1. Get latest commit SHA: git rev-parse HEAD
# 2. POST https://api.vercel.com/v13/deployments?teamId=[TEAM_ID]
#    { "name": "ironcladjustice-[slug]",
#      "project": "[PROJECT_ID]",
#      "gitSource": { "type": "github", "org": "atumcaseclaim",
#        "repo": "ironcladjustice-main", "ref": "main", "sha": "[SHA]" },
#      "target": "production" }

# ⚠️ After domain is added, check Vercel for the CNAME target
# It will be a specific hash like: e37a2e4740c0478d.vercel-dns-017.com
# DO NOT use the generic cname.vercel-dns.com — it will cause a DNS warning

# Future pushes to ironcladjustice-main/[slug]/ auto-trigger redeploy — no manual step needed
```

---

## Phase 7 — DNS (Namecheap API)

⚠️ **VPN must be active** — API key is whitelisted to IP `136.242.94.183`

```bash
NC_USER="atumlegal"
NC_KEY="91bc864a2b8c4b9f9872dd7c2d806a24"
NC_IP="136.242.94.183"

# Step 1: GET all existing records (NEVER SKIP)
GET https://api.namecheap.com/xml.response
  ?Command=namecheap.domains.dns.getHosts&SLD=ironcladjustice&TLD=com

# Step 2: Append new CNAME — preserve ALL existing records exactly
# New record: HostName=[slug], RecordType=CNAME, Address=[vercel-specific-cname], TTL=300

# Step 3: SET full array (existing + new)
POST https://api.namecheap.com/xml.response
  Command=namecheap.domains.dns.setHosts
  [all existing records preserved] + [new CNAME]

# Step 4: Verify — re-GET and confirm [slug] CNAME appears
```

**Hard rule:** `setHosts` replaces ALL records. Setting only the new record would wipe the entire zone.

---

## Phase 8 — Verify Live Page

- [ ] `https://[slug].ironcladjustice.com` loads (DNS may take 5–30 min)
- [ ] ATTENTION headline shows dynamic city/state (not "RESIDENT")
- [ ] Form validation: bad phone rejected, empty required fields show error, TCPA required
- [ ] Submit a test lead → confirm it appears in TrackDrive
- [ ] No broken images

---

## Phase 9 — Buyer Setup (PAUSED)

**Goal:** Fully configure the buyer in TrackDrive but keep it paused until compliance + test lead approval.

### 9a. Create buyer record
```bash
POST /api/v1/buyers
# Flat JSON — no wrapper
{
  "name": "[Buyer Name] - [Case Name]",
  "number": "+1[campaign-caller-id-digits]",   # required even for web buyers
  "paused": true
}
# → Returns buyer.id
```

### 9b. Create outgoing webhook
```bash
POST /api/v1/outgoing_webhooks
# Flat JSON
{
  "name": "[Buyer Name] - [Case Name] Webhook",
  "buyer_id": [BUYER_ID],
  "offer_id": [OFFER_ID],    # ⚠️ Must be set here at creation — cannot be updated via PUT
  "enabled": false
}
# → Returns outgoing.id (NOT outgoing_webhook.id — key is "outgoing")
```

### 9c. Set webhook URL
```bash
POST /api/v1/outgoing_webhook_urls
{
  "outgoing_webhook_id": [WEBHOOK_ID],
  "remote_url": "[buyer-endpoint-url]",
  "remote_method": "post"    # lowercase; valid: get, post, post_body, post_api_v1, put, delete, patch
}
# → Returns outgoing_url.id — save this as URL_ID (needed for webhook params)
```

### 9d. Map webhook params (field name translation)
```bash
# For each field: POST /api/v1/webhook_params
# ⚠️ Use outgoing_webhook_url_id (URL_ID), NOT outgoing_webhook_id
# ⚠️ Field is "key" not "name"
{
  "outgoing_webhook_url_id": [URL_ID],
  "key": "[buyer-field-name]",
  "value": "{{{[trackdrive-token]}}}"    # for dynamic fields
  # OR
  "value": "[literal-value]"             # for fixed fields
}
```

**Standard token references:**
| Buyer field | TrackDrive token |
|-------------|-----------------|
| first_name | `{{{first_name}}}` |
| last_name | `{{{last_name}}}` |
| phone | `{{{phone_number}}}` |
| email | `{{{email}}}` |
| ip_address | `{{{ip_address}}}` |
| trusted_form_cert_url | `{{{trusted_form_cert_url}}}` |
| td_id / lead_id | `{{{id}}}` |
| [contact_field_key] | `{{{[key]}}}` |

### 9e. Configure routing filters
```bash
# Webhook has a record_token_filter auto-created at webhook creation
# GET its ID from the webhook object: outgoing.record_token_filter_id
# Then add conditions:
POST /api/v1/record_token_params
{
  "record_token_filter_id": "[FILTER_ID]",
  "key": "[contact_field_key]",
  "operator": "==",            # ONLY valid operators: "==" and "!="
  "values": ["[value]"]        # ALWAYS an array, even for single values
  # For OR (multiple accepted values): "values": ["value1", "value2"]
}
# One POST per filter condition
```

### 9f. Verify configuration
```bash
# Re-fetch webhook and confirm:
GET /api/v1/outgoing_webhooks/[WEBHOOK_ID]
# Check: buyer_id, offer_id, outgoing_url_ids, record_token_filter_data

# List all filter conditions:
GET /api/v1/record_token_params?record_token_filter_id=[FILTER_ID]
# Confirm correct keys, operators, values — delete any test/probe records
```

---

## Phase 10 — Homepage Update

```bash
# Edit: ironcladjustice-deploy/index.html
# 1. Add case card to .cases-grid section
# 2. Add footer link to Cases column
# Use official subdomain URL (not temp Vercel URL) even if DNS not yet propagated

# Commit and push
cd ironcladjustice-deploy/
git add index.html
git commit -m "Add [Case Name] case card and footer link"
git push
# Vercel auto-deploys ironcladjustice-main
```

---

## Phase 11 — Go-Live (Separate Directive — After Compliance Approval)

1. Send `[slug].ironcladjustice.com` to buyer's compliance depot
2. Await compliance approval
3. Unpause buyer in TrackDrive: `PUT /api/v1/buyers/[BUYER_ID]` → `{"paused": false}`
4. Submit test lead through live form
5. Notify buyer: "Test lead submitted — please confirm receipt and approval"
6. Await buyer approval
7. Open live traffic

---

## Phase 12 — Token Cleanup

| Token | Revoke At |
|-------|-----------|
| GitHub PAT | github.com/settings/tokens — revoke after push confirmed |
| Vercel API Token | vercel.com/account/tokens — revoke after DNS resolves |
| TrackDrive Dev Token | TrackDrive account → Developer Tokens — revoke after buyer configured |
| Namecheap API Key | Retain (static whitelisted IP — no rotation needed unless IP changes) |

---

## Known API Quirks (Quick Reference)

| System | Quirk | Correct Approach |
|--------|-------|-----------------|
| TrackDrive | Auth header | `Authorization: Token <raw_token>` — no "Bearer", no "token=" |
| TrackDrive | Most POST bodies | **Flat JSON** — no wrapper object (e.g., not `{"buyer": {...}}`) |
| TrackDrive | Buyer create | Always requires `number` in E.164 format even for web buyers |
| TrackDrive | Outgoing webhook | `offer_id` can only be set at creation — PUT does not update it |
| TrackDrive | Webhook URL response | Response key is `outgoing_url` (not `outgoing_webhook_url`) |
| TrackDrive | Webhook params | Use `outgoing_webhook_url_id` (the URL record ID, not webhook ID) |
| TrackDrive | Filter operators | Only `==` and `!=`; multi-value OR = `values: ["a","b"]` with `==` |
| TrackDrive | Filter values | Always `values: [...]` array — never the singular `value` field |
| Vercel | CNAME target | Always use the specific hash CNAME from Vercel (not `cname.vercel-dns.com`) |
| Vercel | Project creation | Use REST API — MCP has no create-project tool |
| Vercel | New case project | Set `rootDirectory` at creation to the subdirectory name; link to `ironcladjustice-main` |
| GitHub | New case | Add a subdirectory in `ironcladjustice-main` — no new repo needed |
| Namecheap | setHosts | Replaces ALL records — always GET first, append, then SET full array |

---

## Approval Gates Summary

| Gate | Trigger | What You Review |
|------|---------|-----------------|
| Content | Phase 2 complete | Page title, meta, attention subheading, form questions + values, editorial paragraphs |
| Image | Phase 3 candidates presented | Select one, or provide your own |
| Buyer go-live | Phase 11 setup complete | Field mapping + routing logic before first real leads flow |
| Compliance | Buyer-side | Buyer's compliance depot must approve landing page before traffic |

**Approval format:** Reply "approved" or "approved, with change: [specific change]"
Silence is not approval.

---

## Review Points (Checkpoints During Each Launch)

After each phase, confirm before proceeding:

| After Phase | Confirm |
|-------------|---------|
| 1 (TrackDrive) | `lead_token` retrieved, all default + case-specific fields created |
| 2 (Content) | Explicit "approved" received |
| 3 (Image) | Image selected or confirmed |
| 4 (Build) | Grep check returns zero `[BRACKET]` hits |
| 5 (GitHub) | Subdirectory visible at github.com/atumcaseclaim/ironcladjustice-main/tree/main/[slug] |
| 6 (Vercel) | Deployment state = READY; Vercel-specific CNAME noted |
| 7 (DNS) | setHosts returns OK; re-GET confirms [slug] CNAME present; all previous records intact |
| 8 (Verify) | Page live, geo headline working, test lead in TrackDrive |
| 9 (Buyer) | Filter conditions verified — delete any probe/test records created during API exploration |
| 10 (Homepage) | New card visible at www.ironcladjustice.com |

---

## Default Contact Fields CSV

Reference file: `Form field template - default contact fields.csv`
Corrected and finalized 2026-05-14. Use this file as-is for all new offers.
