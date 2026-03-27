# 1. Content Management Architecture

Date: 2026-03-27

## Status

Accepted

## Context

The Saint Honoré bakery website is a static site (Cloudflare Workers, HTML templates + JSON data) that requires a way for the bakery owner to manage menu items, store hours, and gallery images without coding.

We considered two primary approaches:
1. **Decap CMS with OAuth Proxy**: A visual admin dashboard at `/admin`. This requires registering a GitHub OAuth Application and deploying an intermediate Cloudflare Worker to handle the OAuth handshake.
2. **Direct GitHub JSON Editing**: The owner edits the `content/*.json` files directly through the GitHub web interface.

The key constraints were providing an easy editing experience while minimizing operational overhead, zero-idle-cost, and development friction.

## Decision

We have decided to proceed with **Direct GitHub JSON Editing** for the initial phase, pausing the Decap CMS OAuth proxy setup.

The workflow:
1. The owner updates `content/*.json` directly in the GitHub web interface.
2. Committing the changes triggers our existing GitHub Actions CI/CD pipeline.
3. The pipeline builds the HTML from JSON and deploys to Cloudflare natively.

## Consequences

### Positive
- **Zero Infrastructure Margin:** We avoid deploying and maintaining a secondary authentication proxy Worker.
- **Immediate Readiness:** The pipeline is fully operational right now with no extra setup steps (e.g., no OAuth tokens/secrets to manage).
- **Security:** Reduced attack surface by relying entirely on GitHub's native authentication and removing external proxy dependencies.

### Negative
- **Editor UX:** The owner must interact with raw JSON syntax. They need to be careful with commas, quotes, and brackets to avoid breaking the build.
- **Asset Management:** Uploading images is less streamlined (requires uploading to `public/images/` via GitHub UI, then manually putting the filename in `gallery.json`).

### Mitigation & Future Proofing
We have already built and committed the Decap CMS admin panel (`public/admin/index.html` and `config.yml`). If JSON-editing proves too error-prone for the owner, we can seamlessly "promote" the CMS by simply deploying the OAuth proxy Worker later, with the collections schema already fully tested and in place.
