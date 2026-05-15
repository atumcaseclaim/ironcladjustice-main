# ICJ Case Launch — Team Guide
# What we do, what you provide, and where to review

---

## How to Start a Clean Session

At the beginning of any new Claude session, paste this exact message:

```
Please read the following files before we begin:
- /Users/richconnelly/Desktop/CLAUDE WORKSPACE/ironcladjustice-deploy/WORKFLOW_TEMPLATE.md
- /Users/richconnelly/Desktop/CLAUDE WORKSPACE/ironcladjustice-deploy/TEMPLATE_RULES.md
- /Users/richconnelly/Desktop/CLAUDE WORKSPACE/ironcladjustice-deploy/OPERATIONS_SOP.md

Then confirm you are ready to begin a new case launch.
```

Claude will read all three files and confirm. Everything it needs to run the workflow correctly is in those documents. You do not need to re-explain the process.

---

## What You Need to Gather Before Starting

Do not begin a session until you have all of the following. Missing any item will pause the launch.

### From the Law Firm / Buyer
- [ ] **Case criteria doc** — qualifying and disqualifying factors, damage thresholds, time periods, property/injury requirements
- [ ] **Buyer posting spec** — their endpoint URL, API key or auth method, their exact field names, what values they accept, and what a successful response looks like
- [ ] **Buyer API key** — the key that goes in the POST body when sending leads to them

### Credentials (you hold these — provide fresh each session)
- [ ] **TrackDrive Developer Token** — from your TrackDrive account under Developer Tokens
- [ ] **GitHub Personal Access Token (PAT)** — generate at github.com/settings/tokens, `repo` scope only. Revoke after launch.
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
**What happens:** Creates the GitHub repo under `atumcaseclaim` and pushes the page and image.

**You provide:** GitHub PAT (at the start of session — used here)

---

### STEP 6 — Vercel
**Who does it:** Claude  
**What happens:** Creates the Vercel project, links it to the GitHub repo, adds the subdomain, and triggers the first deployment.

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
**What happens:** Revoke the GitHub PAT and Vercel token — they are single-use per launch.

- GitHub PAT: github.com/settings/tokens
- Vercel token: vercel.com/account/tokens

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

All operational docs live in: `/Users/richconnelly/Desktop/CLAUDE WORKSPACE/ironcladjustice-deploy/`  
Also pushed to GitHub: `github.com/atumcaseclaim/ironcladjustice-main`

| File | Purpose |
|------|---------|
| `WORKFLOW_TEMPLATE.md` | Full technical workflow with all API details |
| `TEMPLATE_RULES.md` | Frozen design elements — what never changes |
| `OPERATIONS_SOP.md` | Scope rules, trigger keywords, approval gates |
| `CASE_LAUNCH_GUIDE.md` | This file — team-facing step-by-step |
| `CASE_TEMPLATE/index.html` | Master HTML template for all new case pages |
| `Form field template - default contact fields.csv` | Default TrackDrive contact fields for every offer |
