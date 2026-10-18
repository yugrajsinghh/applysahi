# ApplySahi V1

ApplySahi resizes exam photographs and signatures in the student's browser. Images stay on the device and are not uploaded to a ApplySahi server.

## Open in VS Code

1. Open this folder in VS Code.
2. Open **Terminal > New Terminal**.
3. Install the project packages:

   ```bash
   npm install
   ```

4. Start the local website:

   ```bash
   npm run dev
   ```

5. Open the local address shown in the terminal, normally `http://localhost:3000`.

## Useful commands

```bash
npm run dev
npm run build
node --test tests/image-fit.test.mjs
```

## Main files

- `app/page.tsx` — homepage and image-resizing experience
- `app/globals.css` — site appearance and responsive layout
- `components/exam-requirements.tsx` — searchable exam library interface
- `lib/exam-requirements.ts` — requirements for 56 exams
- `lib/image-fit.ts` — resize, crop and compression logic
- `lib/image-metadata.ts` — safe image-dimension checks
- `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/about/page.tsx` — information pages

## Current V1 limits

- Supported input formats: JPG, PNG and WebP
- Maximum input size: 25 MB
- PDF and HEIC input are not yet supported
- Exam rules can change, so official notices must be checked and updated regularly

## Privacy model

Image editing runs locally in the visitor's browser. ApplySahi V1 has no user accounts, image database or cloud image storage.

## SEO launch setup

The project includes unique metadata, canonical URLs, `robots.txt`, an XML sitemap, WebSite/WebApplication structured data, and dedicated pages for 15 high-demand exams.

Set these environment variables in the hosting dashboard before the production build:

- `NEXT_PUBLIC_SITE_URL=https://your-final-domain.in` (no trailing slash)
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...` (the HTML-tag verification value supplied by Google Search Console)

After the domain is live:

1. Add the exact `https://` domain property in Google Search Console.
2. Copy its HTML-tag verification value into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploy.
3. Submit `https://your-final-domain.in/sitemap.xml`.
4. Inspect the homepage and the most important `/exams/...` pages and request indexing.
5. Keep each exam's cycle, official source and last-reviewed date current.

Do not publish the production build with the demo URL as `NEXT_PUBLIC_SITE_URL`; canonical URLs and the sitemap must use the final domain.
