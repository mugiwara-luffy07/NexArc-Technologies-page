# NexArc Technologies website

Marketing site for NexArc Technologies. Next.js 15 (App Router), Tailwind CSS v4, MDX content, Supabase + Resend for leads, deployed on Vercel.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run test:e2e     # Playwright on Desktop Chrome, iPhone 14, Pixel 7, iPad
```

Without Supabase/Resend keys, form submissions are printed to the server console in development. In production the forms refuse to accept a lead until at least one of them is configured, so nothing is silently lost.

## Editing content

| What | Where |
|---|---|
| Services | `content/services/*.mdx` (frontmatter: title, summary, deliverables, stack, faq, optional `startingFrom`) |
| Case studies | `content/work/*.mdx` (+ screenshots in `public/work/`, `cover` and `coverTall` in frontmatter) |
| Products | `content/products/*.mdx` (`status: live` or `soon`) |
| Contact details, nav, tagline | `src/lib/site.ts` |
| Brand tokens (colours, radius, type scale) | `src/app/globals.css` |
| Form options (budgets, timelines, tracks) | `src/lib/validators.ts` |

Search the repo for `TODO(content)` and `TODO(legal)` to find everything still waiting on real content.

Writing rules for site copy: no em or en dashes (the tests fail on them), no invented stats or testimonials, one label per call to action ("Start a project" for contact).

## Going live

### 1. Supabase (lead storage)
1. Create a project at supabase.com.
2. SQL Editor: run `supabase/migrations/0001_leads.sql`. It creates the `leads` table and a private `resumes` bucket.
3. Project Settings > API: copy the Project URL and the `service_role` key. The service role key is server-only; never put it in a `NEXT_PUBLIC_` variable.
4. Leads appear in Table Editor > `leads`. Change `status` (new / contacted / won / lost) as you follow up.

### 2. Resend (email notifications)
1. Create an account at resend.com and add the domain `nexarctechnologies.com`.
2. Add the DNS records Resend shows (SPF, DKIM, and a DMARC record) in GoDaddy > DNS.
3. Create an API key.

### 3. Business email
Make sure `sriakash@nexarctechnologies.com` actually receives mail (Zoho Mail free plan or Google Workspace, MX records in GoDaddy). Lead notifications go there.

### 4. Cloudflare Turnstile (spam protection)
Create a Turnstile widget for the domain and copy the site key and secret key.

### 5. Vercel
1. Push this folder to a GitHub repository and import it in Vercel.
2. Add the variables from `.env.example` in Project > Settings > Environment Variables.
3. Deploy. Every pull request gets a preview URL.

### 6. Domain (GoDaddy to Vercel)
1. Vercel > Project > Settings > Domains: add `nexarctechnologies.com` and `www.nexarctechnologies.com`.
2. GoDaddy > DNS:
   - `A` record, host `@`, value `76.76.21.21`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com`
   - Keep the MX and Resend TXT records.
3. Wait for Vercel to show both domains as valid (HTTPS is automatic).

### 7. After launch
- Google Search Console: verify the domain, submit `https://nexarctechnologies.com/sitemap.xml`.
- Google Business Profile for local search.
- Send a real test brief from the live site and check the Supabase row and both emails.
- Paste the link into WhatsApp and LinkedIn to check the preview image.
