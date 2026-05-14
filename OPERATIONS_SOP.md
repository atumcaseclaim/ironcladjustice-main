# Iron Clad Justice — Operations SOP
# Master reference for order of operations, scope rules, and directive keywords

Last Updated: 2026-05-13

---

## How to Use This Document

When giving a directive, use the **trigger keywords** defined in Section 3. Each keyword maps to a precise scope (Section 2). Nothing outside that scope will be touched unless explicitly stated.

This document is the single source of truth for:
- What happens when, and in what order
- What each directive covers and excludes
- What inputs are required before work begins
- What requires approval before proceeding
- Content and tone guardrails

---

## Section 1 — Order of Operations

### Full Sequence: New Case Launch (Zero to Live)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1: BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Receive law firm spec doc
      (qualifying criteria, injury types, product, usage requirements)
  → Confirm case name and subdomain slug
      (e.g., "roundup" → roundup.ironcladjustice.com)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 2: TRACKDRIVE OFFER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Check if offer already exists
  → If not: create offer via API → get lead_token
  → Add campaign-specific contact_fields (qualifying questions)
      (only fields needed for buyer posting — not all law firm criteria)
  → Retrieve posting instructions URL
  → Send posting instructions URL to traffic source

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 3: CONTENT  ⛔ APPROVAL GATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Draft from law firm spec doc:
      - Page title + meta description
      - Attention subheading
      - Qualifying questions (form labels and dropdown values)
      - Editorial paragraphs (4-6, right column)
  → Deliver draft in chat for review
  → HOLD — nothing proceeds until Rich explicitly approves

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 4: IMAGE  ⛔ APPROVAL GATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Search Unsplash + Pexels for 2-3 candidates
  → Present each with: description, dimensions, license, URL
  → HOLD — nothing proceeds until Rich selects one or provides their own

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 5: LANDING PAGE BUILD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Copy CASE_TEMPLATE/index.html to ironcladjustice-[case]/
  → Fill all [BRACKET] placeholders with approved content + lead_token
  → Grep check: zero remaining placeholders before proceeding
  → Open in browser for visual sanity check

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 6: GITHUB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Create GitHub repo: atumcaseclaim/ironcladjustice-[case]
  → Push index.html to main branch
  → Confirm repo visible at github.com/atumcaseclaim/ironcladjustice-[case]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 7: VERCEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Create Vercel project, link to GitHub repo
  → Add custom domain: [case].ironcladjustice.com
  → Vercel confirms CNAME target: cname.vercel-dns.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 8: DNS (Namecheap API)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → GET all existing DNS records for ironcladjustice.com (NEVER skip)
  → Append new CNAME: [case] → cname.vercel-dns.com (TTL: 300)
  → SET full record array (existing + new)
  → Propagation begins: 5 min – 48 hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 9: VERIFY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Confirm live at https://[case].ironcladjustice.com
  → Test form validation (bad phone, bad email, unchecked TCPA)
  → Confirm lead ingests into TrackDrive
  → Confirm geolocation headline populates (ATTENTION: CITY, STATE)
  → Confirm no broken images

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 10: HOMEPAGE UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Add new case card to www.ironcladjustice.com homepage
  → Push homepage update → Vercel auto-deploys
  → Verify new card appears and links to correct subdomain

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 11: TOKEN CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Revoke: GitHub PAT, Vercel token, TrackDrive dev token, Namecheap key

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 12: BUYER ONBOARDING  (separate workflow, per buyer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → Triggered by "onboard buyer [name] for [case]"
  → See buyer onboarding scope in Section 2
```

---

## Section 2 — Scope Rules

Each directive has a fixed scope. Work does not bleed into adjacent areas unless explicitly instructed.

### `stand up [case]`
**Full launch.** Executes Phases 1–11 above.
- Creates everything from scratch: TrackDrive offer, landing page, GitHub repo, Vercel project, DNS, homepage card
- Includes both approval gates (content + image)
- Does NOT include buyer onboarding — that's a separate directive

### `onboard buyer [name] for [case]`
**Buyer connection only.**
1. Create buyer record in TrackDrive (`POST /api/v1/buyers`)
2. Configure outgoing webhook to buyer's endpoint (`POST /api/v1/outgoing_webhooks`)
3. Set buyer's receiving URL (`POST /api/v1/outgoing_webhook_urls`)
4. Map TrackDrive field names → buyer's field names (`POST /api/v1/webhook_params`)
5. Configure routing filters — what qualifies a lead for this buyer (`POST /api/v1/schedule_distributions`)
6. Test with manual webhook fire (`POST /api/v1/webhook_manual_fires`)
7. Review response — confirm acceptance/rejection format
8. ⛔ APPROVAL GATE: confirm before first live leads flow to buyer
9. Monitor first live leads via webhook logs (`GET /api/v1/webhook_logs`)
- Does NOT touch: landing page HTML, GitHub, DNS, Vercel, or other buyers

### `add field [field] to [case]`
**Single contact field addition.**
- Adds `contact_field` to existing offer in TrackDrive
- Adds the corresponding form field to the landing page HTML
- Deploys update (git push)
- Does NOT touch: editorial content, routing, buyer configuration, DNS

### `update content on [case]`
**Editorial content only.**
- Changes paragraph text, attention subheading, page title, or meta description
- ⛔ APPROVAL GATE: draft delivered in chat, hold until approved
- Does NOT touch: form fields, TrackDrive contact_fields, routing, DNS, Vercel

### `design change [element] on [pages]`
**Visual/layout changes.**
- Check TEMPLATE_RULES.md first — if element is frozen, requires explicit approval
- If not frozen: make change, deploy to all named pages
- Does NOT touch: TrackDrive, DNS, buyer configuration

### `push live [case/page]`
**Deploy only.**
- Commits and pushes existing local changes to GitHub
- Triggers Vercel auto-deploy
- No content generation, no API calls, no DNS changes
- Assumes all changes are already approved and in local files

### `draft [content type] for [case]`
**Content generation only — nothing is committed or deployed.**
- Produces copy for review in chat
- No files are written, no APIs called
- Requires explicit "approved" before anything is built from the draft

### `map fields for [buyer] on [case]`
**Field name translation only.**
- Updates `webhook_params` for an existing buyer
- Does NOT recreate the buyer record or webhook URL

### `update routing for [buyer] on [case]`
**Routing filter update only.**
- Updates `schedule_distributions` for an existing buyer
- Does NOT touch webhook URL, field mapping, or buyer record

### `verify [case/integration]`
**Read-only check.**
- Reviews live site, TrackDrive lead flow, or webhook logs
- No changes made

---

### Permanently Out of Scope (unless explicitly overridden)

- Modifying any element listed as frozen in `TEMPLATE_RULES.md`
- Creating new TrackDrive accounts, users, or organizations
- Purchasing domain names or phone numbers
- Modifying payout/revenue configurations in TrackDrive
- Deploying without approval where an approval gate applies
- Changing any buyer's live configuration without a new directive

---

## Section 3 — Trigger Keywords

These words have fixed operational meanings. Using them in a directive activates a specific workflow.

| Keyword / Phrase | Operation Triggered |
|------------------|---------------------|
| **"stand up"** | Full new case launch — Phase 1 through 11 |
| **"onboard"** | Connect a new external entity (buyer or traffic source) to an existing campaign |
| **"add"** | Append to something existing without replacing it |
| **"update"** | Modify something that already exists |
| **"push live"** | Deploy committed local changes via git push |
| **"draft"** | Generate content for review only — nothing deployed or committed |
| **"map"** | Configure field name translation (TrackDrive → buyer format) |
| **"route"** | Configure which leads flow to which buyer via schedule_distributions |
| **"brief"** | Deliver a law firm spec doc or case summary to kick off a new campaign |
| **"verify"** | Audit or check a live site or integration — read only, no changes |

**Disambiguation rule:** if a directive contains two trigger keywords that could conflict (e.g., "update and push live the content on talcum"), the more specific one takes precedence and the sequence is: update → approval gate → push live.

---

## Section 4 — Inputs Required Per Directive

Before starting any directive, confirm all required inputs are present. Missing inputs = work does not begin.

### "stand up [case]"
- [ ] Law firm spec doc (qualifying criteria, injury types, usage requirements, time period)
- [ ] Case/product name confirmed
- [ ] Subdomain slug confirmed (e.g., `roundup`)
- [ ] TrackDrive Developer Token
- [ ] GitHub Personal Access Token
- [ ] Vercel API Token
- [ ] Namecheap API key + whitelisted IP

### "onboard buyer [name] for [case]"
- [ ] Buyer's posting spec / integration doc
      (endpoint URL, auth method, field names, accepted values, response format)
- [ ] Which case(s) this buyer covers
- [ ] Volume caps or geo restrictions (if any)
- [ ] TrackDrive Developer Token

### "add field [field] to [case]"
- [ ] Field name (as it appears in TrackDrive and the POST body)
- [ ] Field type: `yes_no` | `select` (with values) | `text`
- [ ] Label displayed to the user on the form
- [ ] GitHub PAT (for deploy)

### "update content on [case]"
- [ ] Which section to update, or instruction to redraft entirely
- [ ] GitHub PAT (for deploy after approval)

### "map fields for [buyer] on [case]"
- [ ] Buyer's field name list (their exact parameter names)
- [ ] Corresponding TrackDrive field names
- [ ] TrackDrive Developer Token

---

## Section 5 — Approval Gates

The following require explicit approval in chat before proceeding. Silence is not approval.

| Gate | What is Reviewed | Who Approves |
|------|-----------------|--------------|
| **Content** | Editorial copy, qualifying questions, dropdown values, page title, meta description | Rich |
| **Image** | Stock image candidates (description + link), or confirmation of provided image | Rich |
| **Frozen element change** | Any modification to an element listed in TEMPLATE_RULES.md as frozen | Rich |
| **Buyer webhook live** | Review of field mapping + routing before first real leads flow to buyer | Rich |

Format for approval: "approved" or "approved, with change: [specific change]" in chat.

---

## Section 6 — Content Generation Rules

All landing page copy must conform to the following. These rules apply until a formal brand guide supersedes them.

### Mandatory Hedged Language

| Use This | Not This |
|----------|----------|
| "may be entitled to compensation" | "will receive a settlement" |
| "studies have shown" | "it is proven that" |
| "you may qualify" | "you qualify" |
| "alleged to" / "claims allege" | "causes" (as a proven statement) |
| "significant compensation may be available" | "average payout is $X" |
| "seek justice and compensation" | "guaranteed outcome" |

### Hard Rules

- **No specific dollar amounts** — ever
- **No guaranteed outcomes** — ever
- **No attorney or law firm names** in copy
- **No absolute causal claims** — always "linked to" or "associated with"
- **No urgency manufactured by fake deadlines** — only real statute of limitations language if applicable

### Copy Structure (right column, 4-6 paragraphs)

1. **Establish the product and its widespread use** — empathetic, matter-of-fact
2. **Introduce the alleged harm** — "studies have linked," "lawsuits allege"
3. **Describe who is affected** — specific but not restrictive
4. **Signal the legal action underway** — "thousands are seeking justice"
5. **Qualifying criteria paragraph** — who may be eligible (hedged)
6. **Call to action** — drives toward the form; urgent but not manipulative

### Attorney Advertising Compliance

Every page includes the frozen disclaimer:
> "Attorney Advertising Disclaimer: The information you obtain at this site is not, nor is it intended to be, legal advice. You should consult an attorney for advice regarding your individual situation. Prior results do not guarantee a similar outcome."

This text is frozen and must appear verbatim. See TEMPLATE_RULES.md.

---

## Section 7 — Qualifying Criteria vs. Form Fields

**Important distinction:** the law firm's qualifying criteria is not the same as what goes on the form.

The form is built based on what is **required for buyer posting** — the minimum data points needed to route and qualify a lead for the buyer. The law firm may have additional internal criteria that they apply on their end.

When building the form from a law firm spec doc:
1. Identify which criteria the buyer requires in the POST body
2. Only those criteria become form fields
3. Other criteria (e.g., statute of limitations checks the buyer does internally) do not need to be on the form
4. When in doubt: ask before adding a field — fewer fields = higher form completion rate

---

## Section 8 — Communications Reference

### Starting a New Campaign
> "Brief — [Case Name]: here is the law firm spec doc. Subdomain slug: [slug]."

### Updating an Existing Campaign
> "Update content on [case] — [specific change or 'full redraft']."
> "Add field [field name] to [case] — type: [yes/no|select|text], label: [user-facing label]."

### Onboarding a Buyer
> "Onboard buyer [Buyer Name] for [case] — here is their spec doc."

### Deploying
> "Push live [case]." (assumes local files are ready and approved)

### Checking Status
> "Verify [case]." or "Verify buyer [name] on [case]."

### Getting a Draft Without Deploying
> "Draft content for [case] based on this spec: [paste spec]."

---

*This SOP evolves. When a brand guide is finalized, Section 6 is updated to reference it. When new directives are established, Section 3 is updated. Always treat the most recent version of this file as authoritative.*
