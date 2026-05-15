# ICJ Case Launch — Team Guide
# What we do, what you provide, and where to review

---

## How to Start a Clean Session

**Step 1 — Find and sync your local workspace.** At the beginning of any new Claude session, paste this exact message:

```
Find the ironcladjustice-deploy directory on this machine (it lives somewhere inside a "CLAUDE WORKSPACE" folder), then run `git pull origin main` to sync the latest from GitHub. Set that path as $ICJ_WORKSPACE for this session.

Then read the following files:
- $ICJ_WORKSPACE/WORKFLOW_TEMPLATE.md
- $ICJ_WORKSPACE/TEMPLATE_RULES.md
- $ICJ_WORKSPACE/OPERATIONS_SOP.md
- $ICJ_WORKSPACE/CASE_LAUNCH_GUIDE.md

Confirm you are ready to begin.
```

This works from any machine regardless of where the folder lives. GitHub is the source of truth — the pull ensures you have the latest docs, templates, and site files before starting.

**First time on a new machine?** See the one-time machine setup at the bottom of this file.

---

## What You Need to Gather Before Starting

Do not begin a session until you have all of the following. Missing any item will pause the launch.

### From the Law Firm / Buyer
- [ ] **Case criteria doc** — qualifying and disqualifying factors, damage thresholds, time periods, property/injury requirements
- [ ] **Buyer posting spec** — their endpoint URL, API key or auth method, their exact field names, what values they accept, and what a successful response looks like
- [ ] **Buyer API key** — the key that goes in the POST body when sending leads to them

### Credentials (you hold these — provide fresh each session)
- [ ] **TrackDrive Developer Token** — from your TrackDrive account under Developer Tokens
- [ ] **GitHub PAT** — only needed if the monorepo remote is not already authenticated locally. Check first — usually not needed.
- [ ] **Vercel API Token** — generate at vercel.com/account/tokens, Full Account. Revoke after launch.
- [ ] **Namecheap API Key** — already set up (`atumlegal` account). Just confirm your VPN is active before Claude calls the DNS API.

### Case Basics
- [ ] **Case name** — human-readable (e.g., "Roundup Herbicide", "Camp Lejeune")
- [ ] **Subdomain slug** — short, lowercase, hyphenated (e.g., `roundup`, `camp-lejeune`)

### Optional
- [ ] **Hero image** — if you have one, drop the file path. If not, Claude will find 2–3 candidates for you to choose from.

---

## Step-by-Step: What Happens and When You're Needed

---

### STEP 1 — TrackDrive Setup
**Who does it:** Claude  
**What happens:** Creates the campaign offer in TrackDrive (or finds the existing one), adds all standard contact fields, then adds the case-specific qualifying fields. Retrieves the lead token and posting instructions URL.

**You provide:** TrackDrive Developer Token  
**You receive:** Posting instructions URL to send to your traffic source

---

### STEP 2 — Content Draft
**Who does it:** Claude drafts → **You review and approve**

Claude writes:
- Page title and meta description
- The attention headline subheading
- All form question labels and dropdown options
- 4–6 editorial paragraphs (right column copy)

**⛔ REVIEW POINT — nothing moves forward until you reply "approved"**

Check for:
- Accuracy against the case criteria doc
- Tone (hedged, no dollar amounts, no guarantees)
- Form questions match what the buyer requires

Reply: **"approved"** or **"approved, with change: [what to change]"**

---

### STEP 3 — Image Selection
**Who does it:** Claude sources → **You select**

If you didn't provide an image, Claude presents 2–3 stock photo options with descriptions and links.

**⛔ REVIEW POINT — pick one or drop your own file path**

---

### STEP 4 — Landing Page Build
**Who does it:** Claude  
**What happens:** Builds the complete HTML page from the template using your approved content. Runs an automatic check to confirm no placeholder text remains.

**You are not needed here.** Claude flags you if anything is missing.

---

### STEP 5 — GitHub
**Who does it:** Claude  
**What happens:** Adds the new case as a subdirectory (`[slug]/`) in the shared `ironcladjustice-main` repo and pushes it. No new GitHub repo is created — all ICJ sites live in one repo.

**You provide:** Nothing — no PAT needed (repo is already configured locally)

---

### STEP 6 — Vercel
**Who does it:** Claude  
**What happens:** Creates a new Vercel project linked to `ironcladjustice-main` with `rootDirectory` set to the new subdirectory, adds the subdomain, and triggers the first deployment.

**You provide:** Vercel API Token (at the start of session — used here)

---

### STEP 7 — DNS
**Who does it:** Claude  
**What happens:** Reads all existing DNS records for ironcladjustice.com, adds the new subdomain CNAME, and writes the full record set back. Verifies the update.

**Your only job:** Make sure your **VPN is active** before this step. The Namecheap API only accepts calls from the whitelisted IP.

---

### STEP 8 — Live Verification
**Who does it:** Claude checks → **You confirm visually if desired**

Claude verifies:
- Page loads at the new subdomain
- Geolocation headline is dynamic (shows city/state)
- Form validation is working
- A test lead appears in TrackDrive

DNS can take 5–30 minutes. Claude will check and report back.

---

### STEP 9 — Buyer Setup (Paused)
**Who does it:** Claude  
**What happens:** Creates the buyer record in TrackDrive, sets the posting URL, maps all field names from TrackDrive to the buyer's format, and sets the routing filters (which leads qualify to be sent). Buyer is set to **paused** — no leads flow yet.

**You provide:** Buyer posting spec and API key (at the start of session)

---

### STEP 10 — Homepage Update
**Who does it:** Claude  
**What happens:** Adds the new case card and footer link to `www.ironcladjustice.com` and deploys. Uses the official subdomain URL even if DNS is still propagating.

---

### STEP 11 — Cleanup
**Who does it:** You  
**What happens:** Revoke the Vercel token (and GitHub PAT if one was used) — single-use per launch.

- Vercel token: vercel.com/account/tokens
- GitHub PAT (if used): github.com/settings/tokens

TrackDrive token: revoke after buyer is fully configured.  
Namecheap key: no rotation needed (static whitelisted IP).

---

### STEP 12 — Go-Live (Separate Session, After Compliance)
**Triggered by:** "Go live [case name]"

Before this happens:
1. Send the landing page URL to the buyer's compliance team for approval
2. Wait for their written confirmation
3. Start a new session and say: **"Go live [case name]"**

Claude will: unpause the buyer, submit a test lead, and confirm the full lead flow works before opening traffic.

---

## Quick Reference — What to Say to Start

| Situation | What to say |
|-----------|-------------|
| New case launch | `"Stand up [case name] — subdomain: [slug]. Here is the spec doc: [paste or attach]"` |
| Go live after compliance approval | `"Go live [case name]"` |
| Add a new buyer to existing case | `"Onboard buyer [name] for [case name] — here is their spec: [paste]"` |
| Update page copy | `"Update content on [case name] — [what to change or 'full redraft']"` |
| Check status | `"Verify [case name]"` |

---

## File Locations (for reference)

All operational docs live in: `$ICJ_WORKSPACE/`  
Also pushed to GitHub: `github.com/atumcaseclaim/ironcladjustice-main`

| File | Purpose |
|------|---------|
| `WORKFLOW_TEMPLATE.md` | Full technical workflow with all API details |
| `TEMPLATE_RULES.md` | Frozen design elements — what never changes |
| `OPERATIONS_SOP.md` | Scope rules, trigger keywords, approval gates |
| `CASE_LAUNCH_GUIDE.md` | This file — team-facing step-by-step |
| `CASE_TEMPLATE/index.html` | Master HTML template for all new case pages |
| `default-contact-fields.csv` | Default TrackDrive contact fields for every offer |

---

## One-Time Machine Setup (new machine only)

Do this once when setting up a new computer. Not needed each session.

```bash
# 1. Create the workspace folder wherever you want it
mkdir -p ~/Desktop/CLAUDE\ WORKSPACE

# 2. Clone the monorepo into it
cd ~/Desktop/CLAUDE\ WORKSPACE
git clone https://github.com/atumcaseclaim/ironcladjustice-main.git ironcladjustice-deploy

# 3. Verify
ls ironcladjustice-deploy/
# Should show: www/ wildfire/ talcum/ hair/ depo/ privacy/ terms/ CASE_TEMPLATE/ *.md
```

After this, the session startup prompt works automatically — Claude will find `ironcladjustice-deploy` inside `CLAUDE WORKSPACE` regardless of the full path.

**Note on git push:** Pushing requires GitHub access. If your machine isn't authenticated, Claude will prompt you for a PAT when it tries to push a new case. Generate a short-lived one at github.com/settings/tokens (`repo` scope), use it for the push, then revoke it.
