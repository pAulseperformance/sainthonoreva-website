# 1. Content Management Architecture

Date: 2026-03-27

## Status

Accepted

## Context

The Saint Honoré bakery website is a static site (Cloudflare Workers, HTML templates + JSON data) that requires a way for the bakery owner to manage menu items, store hours, and gallery images without coding.

We considered two primary approaches:
1. **Decap CMS with OAuth Proxy**: A visual admin dashboard at `/admin`. This requires registering a GitHub OAuth Application and deploying an intermediate Cloudflare Worker to handle the OAuth handshake.
2. **Direct GitHub JSON Editing**: The owner edits the `content/*.json` files directly through the GitHub web interface.

The key constraints were providing an easy editing experience for a non-technical end-user (the bakery owner) while balancing operational overhead.

## Decision

We have decided to proceed with **Decap CMS with an OAuth Proxy Worker**. 

The workflow:
1. The bakery owner logs in at `sainthonoreva.com/admin` using a GUI CMS.
2. The CMS authenticates via a dedicated Cloudflare Worker (`saint-honore-auth`) which proxies the GitHub OAuth flow.
3. The CMS commits changes directly to the `main` branch.
4. The commit triggers our GitHub Actions CI/CD pipeline to build the HTML from JSON and deploy to Cloudflare.

## Consequences

### Positive
- **Editor UX:** The bakery owner gets a tailored, user-friendly graphical interface to edit content and upload images without ever seeing JSON syntax or interacting with GitHub directly.
- **Data Integrity:** The CMS UI enforces the required JSON schema, preventing syntax errors that could break the build.
- **Asset Management:** Image uploads are handled seamlessly through the CMS media library.

### Negative
- **Infrastructure Margin:** We must deploy and maintain a secondary authentication proxy Worker (`saint-honore-auth`).
- **Initial Setup:** Requires registering a GitHub OAuth Application and securely managing the `CLIENT_ID` and `CLIENT_SECRET`.

### Mitigation
We will use an established, lightweight proxy implementation (such as `sterlingwes/decap-proxy` or `sveltia/sveltia-cms-auth`) deployed to a $0-idle-cost Cloudflare Worker to handle the OAuth cleanly.
