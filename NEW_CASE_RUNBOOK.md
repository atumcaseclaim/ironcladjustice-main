# Iron Clad Justice — New Case Subdomain Runbook
# Standing Up a New Case Page from Zero to Live

---

## Architecture Summary

```
TrackDrive Offer (lead_token)
  → Landing Page form POSTs to /api/v1/leads
      → ALL leads ingested (no pre-submit disqualification)
          → Buyer routing filters applied per buyer
              → Outgoing webhook pushes qualified leads to buyer endpoint
```

**Form validation** (client-side) ensures data quality before submission:
- Required fields must be filled
- Phone must be 10 digits — letters/fake numbers rejected
- Email must be valid format if provided
- All dropdowns must have a selection made
- TCPA checkbox must be checked

**Lead qualification** happens at the buyer routing layer — not at the form. All leads that pass form validation are ingested.

---

## Prerequisites

- Law firm spec doc for the case (qualifying criteria, injury types, product details)
- Access to the GitHub account: `atumcaseclaim`
- A valid GitHub Personal Access Token (PAT) with `repo` scope
- A valid Vercel API token
- A valid TrackDrive Developer Access Token (admin/operations scope on `atum-legal` account)
- Namecheap API key (whitelisted IP: `136.242.94.183` — VPN exit node, must be active)
- A case image — either sourced via stock image process or provided directly

> ⚠️ **VPN REQUIRED for Namecheap API calls.** The whitelisted IP `136.242.94.183` is the VPN exit node. Confirm VPN is connected before Step 9. Verify with: `curl -s https://api.ipify.org`

Set your tokens as environment variables before running any curl commands:

```bash
export GITHUB_TOKEN="github_pat_YOUR_TOKEN_HERE"
export VERCEL_TOKEN="vcp_YOUR_TOKEN_HERE"
export TD_TOKEN="YOUR_TRACKDRIVE_DEV_TOKEN"
export TD_BASE="https://atum-legal.trackdrive.com"
export NC_USER="namecheap_username"
export NC_KEY="namecheap_api_key"
export NC_IP="136.242.94.183"
export NC_SLD="ironcladjustice"
export NC_TLD="com"
```

> SECURITY: Revoke all tokens after deployment is confirmed. See final step.

---

## Step 0 — Create or Verify the TrackDrive Offer

**Before touching any HTML**, confirm whether the offer already exists or needs to be created.

### Check if offer exists
```bash
curl -s -H "Authorization: Bearer ${TD_TOKEN}" \
  "${TD_BASE}/api/v1/offers" | python3 -m json.tool | grep -i "[case name]"
```

### If the offer does NOT exist — create it
```bash
curl -X POST \
  -H "Authorization: Bearer ${TD_TOKEN}" \
  -H "Content-Type: application/json" \
  "${TD_BASE}/api/v1/offers" \
  -d '{
    "name": "[CASE_NAME] Claims",
    "campaign_name": "[CASE_SLUG]"
  }'
```
> Save the returned `id` and `lead_token` — you'll need both.

```bash
export OFFER_ID="[returned id]"
export LEAD_TOKEN="[returned lead_token]"
```

### Add campaign-specific contact fields to the offer

For each qualifying question (e.g., `use`, `diagnosed`, `attorney`):

```bash
# Example: creating a "use" yes/no field
curl -X POST \
  -H "Authorization: Bearer ${TD_TOKEN}" \
  -H "Content-Type: application/json" \
  "${TD_BASE}/api/v1/contact_fields" \
  -d '{
    "offer_id": "'${OFFER_ID}'",
    "name": "use",
    "label": "Did you use [product]?",
    "field_type": "select"
  }'
```

For fields with picklist values (select/dropdown):
```bash
# Get the contact_field id from the response above, then add its values:
export FIELD_ID="[returned field id]"

curl -X POST \
  -H "Authorization: Bearer ${TD_TOKEN}" \
  -H "Content-Type: application/json" \
  "${TD_BASE}/api/v1/contact_field_values" \
  -d '{"contact_field_id": "'${FIELD_ID}'", "value": "yes", "label": "Yes"}'

curl -X POST \
  -H "Authorization: Bearer ${TD_TOKEN}" \
  -H "Content-Type: application/json" \
  "${TD_BASE}/api/v1/contact_field_values" \
  -d '{"contact_field_id": "'${FIELD_ID}'", "value": "no", "label": "No"}'
```

### If the offer EXISTS — check what's already configured
```bash
# Get offer details + existing contact fields
curl -s -H "Authorization: Bearer ${TD_TOKEN}" \
  "${TD_BASE}/api/v1/offers/${OFFER_ID}" | python3 -m json.tool

curl -s -H "Authorization: Bearer ${TD_TOKEN}" \
  "${TD_BASE}/api/v1/contact_fields?offer_id=${OFFER_ID}" | python3 -m json.tool
```
Only add fields that don't already exist. Never duplicate.

### Retrieve the posting instructions
```bash
# The posting instructions URL is automatically generated at:
# ${TD_BASE}/posting_instructions/${LEAD_TOKEN}
echo "Posting instructions: ${TD_BASE}/posting_instructions/${LEAD_TOKEN}"
```
This URL goes to the traffic source. The `LEAD_TOKEN` goes into the landing page HTML.

---

## Step 0b — Draft Content & Get Approval

**Input required:** law firm spec doc (qualifying criteria, injury types, product, usage requirements)

From the spec doc, draft the following for review:

1. **Page title** — e.g., `Iron Clad Justice - Roundup Compensation`
2. **Meta description** — 1 sentence, SEO-friendly
3. **Attention subheading** — e.g., `If You Have Used Roundup, You May Be Entitled To Compensation!`
4. **Qualifying questions** — derived from what the buyer requires for posting (not necessarily all criteria)
5. **Injury/diagnosis dropdown options** — with exact `value=""` slugs for TrackDrive
6. **Editorial paragraphs** (4-6) — right column content

**Tone rules (non-negotiable):**
- Hedged language only: "may be entitled," "studies have shown," "you may qualify," "alleged to"
- No specific dollar amounts
- No guaranteed outcomes
- No attorney or law firm names in copy
- Factual → empathetic → action-oriented structure
- Final paragraph always drives toward the form

**⛔ HOLD — do not proceed to Step 0c or beyond until content is explicitly approved.**

---

## Step 0c — Source Image & Get Approval

Search Unsplash (`https://unsplash.com`) and Pexels (`https://pexels.com`) for 2-3 candidate images relevant to the case. Present each with:
- Description of what the image shows
- Dimensions and orientation
- License (Unsplash/Pexels licenses are both free for commercial use)
- Direct URL

User selects one, or provides their own image file.

Once selected:
- Download image and name it `[case].jpg`
- Confirm dimensions are suitable (~800x500px or wider)

**⛔ HOLD — do not proceed to Step 1 until an image is confirmed.**

---

## Step 1 — Copy the Case Template

```bash
# Replace [case] with the short case identifier (e.g., roundup, cpap, hernia)
export CASE="[case]"

cp -r $ICJ_WORKSPACE/CASE_TEMPLATE \
      $ICJ_WORKSPACE/ironcladjustice-${CASE}
```

---

## Step 2 — Fill In All Placeholders

Open `$ICJ_WORKSPACE/ironcladjustice-${CASE}/index.html` and replace every `[BRACKET]` placeholder:

| Placeholder | What to Replace With |
|-------------|----------------------|
| `[PAGE_TITLE]` | Browser tab title, e.g., `Iron Clad Justice - Roundup Compensation` |
| `[META_DESCRIPTION]` | SEO description, e.g., `Free Roundup Cancer Claim Review - No Upfront Cost` |
| `[LEAD_TOKEN]` | Unique TrackDrive token from campaign manager |
| `[CASE_SLUG]` | Campaign name slug, e.g., `roundup-claims` |
| `[PRODUCT_QUESTION]` | First qualifying question, e.g., `Did you regularly use Roundup weed killer?` |
| `[INJURY_OPTIONS]` | `<option value="...">...</option>` tags for diagnosis dropdown |
| `[ATTENTION_SUBHEADING]` | e.g., `If You Have Used Roundup, You May Be Entitled To Compensation!` |
| `[CONTENT_PARAGRAPHS]` | 4-6 `<p>` editorial paragraphs about the case |
| `[CASE_IMAGE_FILENAME]` | Image filename, e.g., `roundup.jpg` |
| `[CASE_NAME]` | Human-readable case name, e.g., `Roundup` |

**The `[LEAD_TOKEN]` value comes from Step 0** — the TrackDrive offer creation/lookup.

**Verify no placeholders remain:**
```bash
grep -n "\[" $ICJ_WORKSPACE/ironcladjustice-${CASE}/index.html
```
This should return zero results before proceeding.

---

## Step 3 — Add the Case Image

Copy the case image into the images directory:

```bash
# Image should be JPG, ~800x500px
cp /path/to/your/image.jpg \
   $ICJ_WORKSPACE/ironcladjustice-${CASE}/images/[CASE_IMAGE_FILENAME]
```

> Note: If the Vercel project serves from the repo root, the image path `/images/filename.jpg` needs to be in the same repo. Alternatively, host images in the main repo and use an absolute URL.

---

## Step 4 — Test Locally

Open the file in a browser before committing:

```bash
open $ICJ_WORKSPACE/ironcladjustice-${CASE}/index.html
```

Check:
- [ ] Header shows "Iron Clad Justice" logo + "FILE YOUR FREE CLAIM TODAY!" CTA
- [ ] Attention box has white background, red left border
- [ ] All form fields present and labeled correctly
- [ ] No `[BRACKET]` text visible on the page
- [ ] Image loads (if testing locally, image may not load — that's okay)
- [ ] Footer shows ICJ copyright and privacy/terms links

---

## Step 5 — Add Case to Monorepo

All ICJ sites live in `atumcaseclaim/ironcladjustice-main`. No new repo is created per case.

```bash
BASE="$ICJ_WORKSPACE"

# Create the case subdirectory and copy in the built files
mkdir -p "${BASE}/${CASE}/images"
cp [built-index.html] "${BASE}/${CASE}/index.html"
# If the case uses an image:
cp [image.jpg] "${BASE}/${CASE}/images/${CASE}.jpg"

# Stage and push
cd "${BASE}"
git add ${CASE}/
git commit -m "Add ${CASE} case landing page"
git push origin main
```

Verify at: `https://github.com/atumcaseclaim/ironcladjustice-main/tree/main/${CASE}`

> **GitHub PAT not needed** — the repo remote is already configured locally.

---

## Step 6 — (Removed — merged into Step 5)

Step 6 (Push Code) is now part of Step 5. Proceed to Step 7.

---

## Step 7 — Create Vercel Project

```bash
curl -X POST \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  https://api.vercel.com/v9/projects \
  -d "{
    \"name\": \"ironcladjustice-${CASE}\",
    \"framework\": null,
    \"rootDirectory\": \"${CASE}\",
    \"gitRepository\": {
      \"type\": \"github\",
      \"repo\": \"atumcaseclaim/ironcladjustice-main\"
    }
  }"
```

> Save the project `id` from the response — you may need it for the domain assignment step.

---

## Step 8 — Add Custom Domain to Vercel Project

```bash
# Domain format: [case].ironcladjustice.com
export SUBDOMAIN="${CASE}.ironcladjustice.com"

curl -X POST \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  "https://api.vercel.com/v9/projects/ironcladjustice-${CASE}/domains" \
  -d "{\"name\": \"${SUBDOMAIN}\"}"
```

**IMPORTANT — Domain Conflict Pitfall:**
If the domain was previously assigned to another Vercel project (e.g., an old caseclaimnetwork project), you must remove it from the old project first:

```bash
# 1. Find which project currently owns the domain
curl -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/domains/${SUBDOMAIN}/config"

# 2. Remove from old project (replace OLD_PROJECT_NAME with actual name)
curl -X DELETE \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/projects/OLD_PROJECT_NAME/domains/${SUBDOMAIN}"

# 3. Then add to new project (re-run the POST above)
```

---

## Step 9 — Configure DNS via Namecheap API

**⚠️ CRITICAL SAFETY RULE: Always GET existing records before SET. The `setHosts` command replaces ALL DNS records for the domain — skipping the GET step will wipe every other record on `ironcladjustice.com`.**

### Step 9a — GET existing DNS records

```bash
curl -s "https://api.namecheap.com/xml.response\
?ApiUser=${NC_USER}\
&ApiKey=${NC_KEY}\
&UserName=${NC_USER}\
&ClientIp=${NC_IP}\
&Command=namecheap.domains.dns.getHosts\
&SLD=${NC_SLD}\
&TLD=${NC_TLD}" | xmllint --format -
```

Parse the response and note every existing `<host>` record — you'll need to include all of them in the SET call.

### Step 9b — SET all records including the new CNAME

Build the full parameter list by combining all existing records + the new CNAME. Parameters are numbered sequentially (HostName1, RecordType1, Address1, TTL1... HostName2, etc.):

```bash
# Example — assumes existing records occupy positions 1..N
# Add the new CNAME as the next position (N+1):
# HostName[N+1]=${CASE}
# RecordType[N+1]=CNAME
# Address[N+1]=cname.vercel-dns.com
# TTL[N+1]=300

curl -X POST "https://api.namecheap.com/xml.response" \
  -d "ApiUser=${NC_USER}\
&ApiKey=${NC_KEY}\
&UserName=${NC_USER}\
&ClientIp=${NC_IP}\
&Command=namecheap.domains.dns.setHosts\
&SLD=${NC_SLD}\
&TLD=${NC_TLD}\
&[ALL_EXISTING_PARAMS]\
&HostName[N+1]=${CASE}&RecordType[N+1]=CNAME&Address[N+1]=cname.vercel-dns.com&TTL[N+1]=300"
```

### Step 9c — Confirm propagation

```bash
# Check Vercel's view of domain status
curl -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/projects/ironcladjustice-${CASE}/domains"
```

Vercel will show `"verified": true` once the CNAME resolves. DNS propagation typically takes 5 minutes to 48 hours.

---

## Step 10 — Add Case Link to Homepage

Open `$ICJ_WORKSPACE/index.html` and add the new case to the case cards section. Follow the same pattern as the existing talcum/hair/depo cards.

Then deploy the homepage update:

```bash
cd $ICJ_WORKSPACE
git add index.html
git commit -m "Add ${CASE} case link to homepage"
git push origin main
```

---

## Step 11 — Verify Live

Once DNS propagates, test the live page at `https://[case].ironcladjustice.com`:

- [ ] Page loads without errors
- [ ] Header: "Iron Clad Justice" logo + "FILE YOUR FREE CLAIM TODAY!"
- [ ] Attention box shows city/state (geolocation working)
- [ ] All form fields present
- [ ] Form submits to TrackDrive (test with dummy data if possible)
- [ ] Footer links to privacy.altrck4.com and terms.altrck4.com
- [ ] No broken images
- [ ] New case appears in homepage case cards

---

## Step 12 — Connect Buyers (Per Buyer — See Buyer Onboarding Process)

Once the case page is live and ingesting leads, buyers are configured independently. Each buyer onboarding is a separate process:

1. Receive buyer's posting spec / integration doc
2. Create buyer record in TrackDrive (`POST /api/v1/buyers`)
3. Configure outgoing webhook to their endpoint (`POST /api/v1/outgoing_webhooks`)
4. Map TrackDrive field names → buyer's field names (`POST /api/v1/webhook_params`)
5. Set routing filters — which leads qualify for this buyer (`POST /api/v1/schedule_distributions`)
6. Test with manual webhook fire and verify response (`POST /api/v1/webhook_manual_fires`)
7. Monitor first live leads via webhook logs (`GET /api/v1/webhook_logs`)

> Each buyer has their own naming conventions and acceptance criteria. The field mapping and filter configuration is done per-buyer based on their spec doc. This is handled case-by-case.

---

## Step 13 — Revoke Tokens

After deployment is confirmed and verified:

1. **GitHub Token:** https://github.com/settings/tokens → find token → Delete
2. **Vercel Token:** https://vercel.com/account/tokens → find token → Delete
3. **TrackDrive Token:** TrackDrive account settings → Developer Tokens → Revoke
4. **Namecheap Key:** Namecheap account → Profile → API Access → regenerate or disable

---

## Quick Reference — Domain Management Curl Commands

```bash
# List all domains on a Vercel project
curl -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/projects/ironcladjustice-${CASE}/domains"

# Add a domain to a project
curl -X POST \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  "https://api.vercel.com/v9/projects/ironcladjustice-${CASE}/domains" \
  -d "{\"name\": \"${SUBDOMAIN}\"}"

# Remove a domain from a project
curl -X DELETE \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/projects/ironcladjustice-${CASE}/domains/${SUBDOMAIN}"

# List all Vercel projects
curl -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/projects"
```

---

## Estimated Timeline

| Step | Time |
|------|------|
| Step 0: Create/verify TrackDrive offer + contact fields | 10 min |
| Step 0b: Draft content → approval gate | 15 min draft + async approval |
| Step 0c: Image sourcing → approval gate | 10 min search + async approval |
| Steps 1–2: Build landing page from template | 10 min |
| Steps 3–6: GitHub repo + push | 5 min |
| Steps 7–8: Vercel project + domain | 5 min |
| Step 9: Namecheap CNAME via API | 5 min |
| DNS propagation | 5 min – 48 hours |
| Steps 10–11: Homepage + verification | 5 min |
| Step 12: Buyer onboarding (per buyer) | 15–30 min each |
| **Total (excl. DNS wait + approval time)** | **~50 minutes** |
| **Total (excl. DNS wait, excl. buyers)** | **~35 minutes** |
