# Iron Clad Justice — Template Rules
# FROZEN ELEMENTS: Do not change without explicit approval

Last Updated: 2026-05-18

---

## 1. HEADER (ALL PAGES — CASE LANDING PAGES)

Case landing pages use a **logo + CTA only** header. No navigation links.

### HTML Structure (frozen)
```html
<header class="icj-nav">
    <div class="icj-nav-inner">
        <div class="icj-logo">Iron&nbsp;<span>Clad</span>&nbsp;Justice</div>
        <div class="icj-cta">FILE YOUR FREE CLAIM TODAY!</div>
    </div>
</header>
```

> Note: Use `&nbsp;` between words in the logo — plain spaces collapse in Tailwind's flex context.

### CSS (frozen — must appear in `<style>` block)
```css
.icj-nav { position: sticky; top: 0; z-index: 1000; background: rgba(15, 23, 42, 0.96); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.08); }
.icj-nav-inner { display: flex; justify-content: space-between; align-items: center; padding: 22px 40px; max-width: 1200px; margin: auto; }
.icj-logo { font-size: 1.8rem; font-weight: 800; color: white; letter-spacing: -0.5px; text-decoration: none; }
.icj-logo span { color: #d4a017; }
.icj-cta { color: #d4a017; font-weight: 800; font-size: 1.4rem; letter-spacing: 0.5px; text-transform: uppercase; }
@media(max-width: 768px) {
    .icj-nav-inner { flex-direction: column; gap: 10px; padding: 18px 20px; text-align: center; }
    .icj-cta { font-size: 1.1rem; }
}
```

**NEVER:** Add navigation links to case landing page headers.
**NEVER:** Change the logo text — it must read `Iron&nbsp;<span>Clad</span>&nbsp;Justice`.
**NEVER:** Change the CTA text without approval.

---

## 2. COLOR PALETTE (frozen)

| Role              | Value                        |
|-------------------|------------------------------|
| Brand gold        | `#d4a017`                    |
| Header navy       | `rgba(15, 23, 42, 0.96)`     |
| Alert red         | `#dc2626`                    |
| Submit button     | `#22c55e` (green-500)        |
| Submit hover      | `#16a34a` (green-600)        |
| Slate body bg     | `#ffffff`                    |
| Slate footer bg   | `#0f172a` (slate-900)        |
| Border gray       | `#e5e7eb`                    |

---

## 3. ATTENTION BOX (ALL CASE PAGES)

### HTML Structure (frozen inline styles)
```html
<div style="background:#fff; border:1px solid #e5e7eb; border-left:6px solid #dc2626; padding:24px 28px; border-radius:10px; box-shadow:0 4px 18px rgba(15,23,42,0.10); margin-bottom:8px;">
    <h1 id="location-headline" style="font-size:1.6rem; font-weight:900; text-transform:uppercase; letter-spacing:0.5px; color:#0f172a; margin-bottom:8px;">
        <span style="color:#dc2626;">ATTENTION:</span> <span id="user-location">RESIDENT</span>
    </h1>
    <p style="font-size:1.1rem; font-weight:600; color:#0f172a; margin:0;">[ATTENTION_SUBHEADING]</p>
</div>
```

**NEVER:** Use a colored background on the attention box.
**NEVER:** Remove the red left border.
**NEVER:** Remove `id="user-location"` — geolocation script writes to this span.

---

## 4. FONTS (frozen)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

```css
body { font-family: 'Inter', system-ui, sans-serif; }
```

---

## 5. FORM ACTION (ALL CASE PAGES — frozen)

```html
<form id="lead-form"
      action="https://atum-legal.trackdrive.com/api/v1/leads"
      method="POST"
      class="space-y-6">
```

**NEVER** change the form action URL.

---

## 6. TRACKDRIVE HIDDEN FIELDS (per-page — frozen values)

These fields must be present exactly as shown. Values differ per page.

### Standard hidden field set (all new cases)
```html
<input type="hidden" name="lead_token" value="[case-specific token]">
<input type="hidden" name="traffic_source_id" value="1">
<input type="hidden" name="campaign_name" value="[case-slug]">
<input type="hidden" name="affid" value="810">
<input type="hidden" name="ip_address" id="data_ip_address">
<input type="hidden" name="xxtrustedformcerturl" value="xxTrustedFormCertUrl">
```

**NEVER** add `<input type="hidden" name="caller_id" ...>` — the static phone number field was removed 2026-05-15. The phone number entered by the user is submitted via `name="caller_id"` on the visible tel input.

### TALCUM (`ironcladjustice-talcum`)
```html
<input type="hidden" name="lead_token" value="1fea3c19e23d45929d40aaaa58b666e8">
<input type="hidden" name="traffic_source_id" value="1">
<input type="hidden" name="campaign_name" value="talcum-powder-claims">
<input type="hidden" name="affid" value="810">
<input type="hidden" name="ip_address" id="data_ip_address">
<input type="hidden" name="xxtrustedformcerturl" value="xxTrustedFormCertUrl">
<input type="hidden" name="diagnosis" value="yes">
<input type="hidden" name="proof" value="yes">
<input type="hidden" name="dl" value="yes">
```

### HAIR (`ironcladjustice-hair`)
```html
<input type="hidden" name="lead_token" value="a9c3d3905c08411fa5598595bc5e425f">
<input type="hidden" name="traffic_source_id" value="1">
<input type="hidden" name="campaign_name" value="talcum-powder-claims">
<input type="hidden" name="affid" value="810">
<input type="hidden" name="diagnosis" value="yes">
<input type="hidden" name="proof" value="yes">
<input type="hidden" name="dl" value="yes">
<input type="hidden" name="data.ip_address" id="data_ip_address">
<input type="hidden" name="data.trusted_form_cert_url" id="xxTrustedFormCertUrl">
```

> NOTE: Hair uses dot-notation field names (`data.ip_address`, `data.trusted_form_cert_url`) — this is intentional and matches the live page. Do NOT normalize to underscore format.

### DEPO (`ironcladjustice-depo`)
> Depo-Provera page does NOT currently have a TrackDrive configuration (matches live depo.ironcladjustice.com). Do not add TrackDrive fields without a new lead_token from the campaign manager.

---

## 7. TRUSTEDFORM SCRIPT (ALL CASE PAGES — frozen)

Must appear verbatim before `</body>` on all case landing pages (talcum, hair, any new cases):

```html
<!-- TrustedForm -->
<script type="text/javascript">
  (function() {
    var tf = document.createElement('script');
    tf.type = 'text/javascript';
    tf.async = true;
    tf.src = ("https:" == document.location.protocol ? 'https' : 'http') +
      '://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&use_tagged_consent=true&l=' +
      new Date().getTime() + Math.random();
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(tf, s);
  })();
</script>
<noscript>
  <img src='https://api.trustedform.com/ns.gif' />
</noscript>
<!-- End TrustedForm -->
```

---

## 8. IP GEOLOCATION SCRIPTS (ALL CASE PAGES — frozen)

Both scripts must appear. Order: IP capture script first, then location script.

### IP Capture Script
```html
<script>
async function getVisitorIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        document.getElementById('data_ip_address').value = data.ip;
    } catch (e) {
        console.log("Could not get IP");
    }
}
window.addEventListener('load', getVisitorIP);
</script>
```

### Location Display Script
```html
<script>
async function fillUserLocation() {
    const locationSpan = document.getElementById('user-location');
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        let displayLocation = "RESIDENT";
        if (data.city && data.region) {
            displayLocation = `${data.city}, ${data.region}`;
        } else if (data.city) {
            displayLocation = data.city;
        } else if (data.country_name) {
            displayLocation = data.country_name;
        }
        locationSpan.textContent = displayLocation;
    } catch (error) {
        console.log("Could not detect location (using fallback)");
    }
}
window.addEventListener('load', fillUserLocation);
</script>
```

**NEVER** remove these scripts. They populate form fields and the dynamic headline.

---

## 9. TCPA CONSENT CHECKBOX (ALL CASE PAGES — frozen)

The checkbox must be `required`. The legal text is frozen — do not paraphrase or shorten.

```html
<div class="flex items-start gap-3 pt-4">
    <input type="checkbox" id="tcpa-consent" required
           class="mt-1 w-5 h-5 accent-green-600">
    <label for="tcpa-consent" class="text-xs leading-relaxed text-slate-600">
        By clicking <strong>"See if I Qualify"</strong>, I provide my electronic signature and consent to be contacted by Iron Clad Justice
        and its partners via calls, texts, and prerecorded messages at the phone number I provided, even if it is on a state, national,
        or company do-not-call list. This consent is made using automated technology and may include prerecorded voices.
        I understand that my consent is not required to obtain any goods or services, and that standard message and data rates may apply.
        I can opt-out at any time.
        I also accept the
        <a href="https://terms.altrck4.com" class="underline hover:text-yellow-400">Terms of Service</a> and
        <a href="https://privacy.altrck4.com" class="underline hover:text-yellow-400">Privacy Policy</a>.
    </label>
</div>
```

---

## 10. SUBMIT BUTTON (frozen)

```html
<button type="submit"
        class="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-6 rounded-2xl transition-all">
    See if I Qualify →
</button>
```

**NEVER** change the submit button text without legal review.

---

## 11. FORM SUBMIT HANDLER (ALL CASE PAGES — frozen pattern)

All case pages use a `fetch()`-based submit handler. The form POSTs to TrackDrive, logs the success/false response to console, then redirects to the ICJ thank you page regardless of outcome.

```html
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('lead-form');
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = 'Submitting...';
            try {
                const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
                const result = await res.json();
                console.log('TrackDrive result:', JSON.stringify(result));
            } catch(err) {
                console.log('Submission error:', err);
            }
            window.location.href = 'https://thankyou.ironcladjustice.com/';
        });
    });
</script>
```

Pages with full validation (wildfire, afff, and any new cases) use the extended version with field-level error display — see those pages for the full pattern. The redirect target is always `https://thankyou.ironcladjustice.com/`.

**NEVER** redirect to `https://thankyou.caseclaimnetwork.com/` — that URL was replaced 2026-05-15.

---

## 12. FOOTER (ALL PAGES — frozen)

```html
<footer class="bg-slate-900 text-white py-10 text-center text-sm">
    <div class="max-w-4xl mx-auto px-6">
        © 2026 Iron Clad Justice • All Rights Reserved<br>
        <a href="https://privacy.altrck4.com/" class="underline hover:text-yellow-400">Privacy Policy</a> |
        <a href="https://terms.altrck4.com/" class="underline hover:text-yellow-400">Terms of Service</a>
    </div>
</footer>
```

> Exception: Depo page footer links use `https://privacy.ironcladjustice.com/` and `https://terms.ironcladjustice.com/` — matches live.

---

## 13. DISCLAIMER SECTION (ALL CASE PAGES — frozen)

```html
<section class="py-12 bg-slate-100 text-sm">
    <div class="max-w-4xl mx-auto px-6 text-center text-slate-600">
        <p>Attorney Advertising Disclaimer: The information you obtain at this site is not, nor is it intended to be, legal advice. You should consult an attorney for advice regarding your individual situation. Prior results do not guarantee a similar outcome.</p>
    </div>
</section>
```

---

## 14. HARD STOP RULES

| Rule | Reason |
|------|--------|
| NEVER change `lead_token` without getting a new token from campaign manager | Wrong token = leads lost in wrong campaign |
| NEVER include `lead_token` value in HTML comments | Token is sensitive — source code is public |
| NEVER change form `action` URL | Leads will stop being captured |
| NEVER remove TrustedForm script | Compliance/fraud prevention requirement |
| NEVER remove TCPA checkbox `required` attribute | Legal compliance |
| NEVER add nav links to case page headers | Design spec: case pages are distraction-free |
| NEVER change attention box to colored background | Brand decision: white-card-with-red-border is final |
| NEVER "fix" hair page dot-notation field names | They match live — changing breaks integration |
| NEVER deploy without testing in browser first | Catch broken layouts before users see them |
| NEVER force-push to main without reviewing diff | Can overwrite working deployments |

---

## 15. GITHUB + VERCEL STRUCTURE

**Single repo monorepo:** All sites live in `atumcaseclaim/ironcladjustice-main`. Each Vercel project uses a `rootDirectory` setting pointing to its subdirectory. A push to `main` auto-deploys only the projects whose tracked subdirectory changed.

| Subdomain | GitHub Path | Vercel Project | rootDirectory |
|-----------|-------------|----------------|---------------|
| www.ironcladjustice.com | `ironcladjustice-main/www/` | ironcladjustice-main | `www` |
| talcum.ironcladjustice.com | `ironcladjustice-main/talcum/` | ironcladjustice-talcum | `talcum` |
| hair.ironcladjustice.com | `ironcladjustice-main/hair/` | ironcladjustice-hair | `hair` |
| depo.ironcladjustice.com | `ironcladjustice-main/depo/` | ironcladjustice-depo | `depo` |
| wildfire.ironcladjustice.com | `ironcladjustice-main/wildfire/` | ironcladjustice-wildfire | `wildfire` |
| thankyou.ironcladjustice.com | `ironcladjustice-main/thankyou/` | ironcladjustice-thankyou | `thankyou` |
| privacy.ironcladjustice.com | `ironcladjustice-main/privacy/` | ironcladjustice-privacy | `privacy` |
| terms.ironcladjustice.com | `ironcladjustice-main/terms/` | ironcladjustice-terms | `terms` |

**Adding a new case:** Create a new subdirectory in `ironcladjustice-main/` (e.g. `hair-relaxer/`), add `index.html`, commit and push. Then create a new Vercel project linked to `ironcladjustice-main` with `rootDirectory` set to the new subdirectory name. No new GitHub repo needed.

Pushing to `main` triggers automatic Vercel rebuilds for affected projects. No manual redeploy needed.

---

## 16. CREDENTIALS & TOKENS (per-session — always revoke after use)

| Service | Purpose | Where to Revoke |
|---------|---------|-----------------|
| GitHub PAT (`repo` scope) | Create repos, push code | github.com/settings/tokens |
| Vercel API Token | Create projects, assign domains | vercel.com/account/tokens |
| TrackDrive Developer Token | Create offers, contact fields, buyers, webhooks | TrackDrive account → Developer Tokens |
| Namecheap API Key + whitelisted IP | GET/SET DNS records for ironcladjustice.com | Namecheap Profile → API Access |

**DNS safety rule:** Namecheap `setHosts` replaces ALL records. Always `getHosts` first, append the new record, then `setHosts` the full array. Never call `setHosts` with only the new record.
