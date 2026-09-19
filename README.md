# n8n-nodes-apivault-tech-stack-lookup

An [n8n](https://n8n.io) community node for **BuiltWith Alternative — Tech Stack Leads & Lookup (60M)**, powered by the [`apivault_labs/tech-stack-lookup` Apify Actor](https://apify.com/apivault_labs/tech-stack-lookup).

Technology leads and tech stack lookup across 60M+ websites. BuiltWith alternative to find websites by technology, check domains, discover Shopify and Klaviyo leads, build lookalike audiences and monitor stack changes. AI/MCP-ready output for B2B sales.

The node is a thin connector: collection, analysis, retries and billing run in the hosted Actor. It contains no private scraper implementation or embedded credentials.

## Installation

1. Open **Settings → Community Nodes** in your n8n instance.
2. Select **Install**.
3. Enter `n8n-nodes-apivault-tech-stack-lookup` and confirm.

## Credentials

Create an **Apify API** credential in n8n and paste your personal token from [Apify Console → Integrations](https://console.apify.com/account/integrations). The token is sent to Apify as a bearer credential and is never bundled with this package.

## Usage

Add **BuiltWith Alternative — Tech Stack Leads & Lookup (60M)** to a workflow, fill the public Actor inputs below, and execute the node. Every Dataset result becomes one n8n item, so it can flow into Sheets, databases, CRMs, alerts or your own code. The node respects n8n's **Continue On Fail** behavior.

## Ready-to-import workflow

Import [`examples/quickstart-workflow.json`](examples/quickstart-workflow.json), select your Apify API credential in the Actor node, replace the sample business inputs and run it. The workflow returns destination-ready rows without exposing Actor internals.

| Input | Type | Description |
|---|---|---|
| `mode` | `string` | find requires technologies, technologyPreset or opportunityPreset; detect requires domains; lookalike requires seed domains; monitor requires domains and a stable monitorName; cata |
| `domains` | `array` | Required when mode is detect, lookalike or monitor; ignored otherwise. Accepts hostnames or URLs. Unknown domains are skipped without a result charge. |
| `technologyPreset` | `string` | Used only when mode=find. Optional shortcut combined with custom Technologies. |
| `opportunityPreset` | `string` | Used only when mode=find. Returns matching leads, missing technology, opportunity score and suggested pitch. |
| `technologies` | `array` | Used only when mode=find. Enter complete product names such as Klaviyo, Stripe, Shopify Plus, HubSpot or Cloudflare. AI agents should prefer technologyPreset for one popular techno |
| `matchMode` | `string` | Used only when mode=find. any = at least one technology (OR); all = every technology (AND). |
| `excludeTechnologies` | `array` | Used only when mode=find. Exclude sites using any listed technology; e.g. Klaviyo leads without Yotpo. |
| `category` | `string` | Used only when mode=find. Limit matching to one stack layer; any is recommended because a product may appear in multiple layers. |
| `country` | `array` | One or more ISO-2 country codes, e.g. US, DE, GB. Type each code and press Enter. Empty — no country filter. |
| `vertical` | `string` | Keep only sites in this industry, e.g. Fashion, Technology, Health, or Food. Leave empty to include every industry. |
| `hasEmail` | `boolean` | Keep only sites where the Emails field is not empty. |
| `hasPhone` | `boolean` | Keep only sites where the Telephones field is not empty. |
| `newWithinDays` | `integer` | Return websites first added to the index within the last N days. Use 7 for a weekly new-lead feed. Set 0 to disable. |
| `lastIndexedWithinDays` | `integer` | Keep websites whose record was indexed within the last N days. Useful for recently refreshed data. Set 0 to disable. |
| `lastFoundWithinDays` | `integer` | Keep websites last observed within the previous N days. Use this to prefer recently confirmed leads. Set 0 to disable. |
| `sortBy` | `string` | Order rows by this column before applying the limit, so you get the top leads instead of an arbitrary slice. Empty — no ordering. |
| `sortDesc` | `boolean` | Highest values first (recommended for scores/traffic/revenue). |
| `dedupeByDomain` | `boolean` | Return each normalized Root Domain only once across all data segments. Recommended for lead exports. |
| `outputPreset` | `string` | essential is recommended for AI and most lead exports; contacts returns contact fields; tech_stack returns technology fields; opportunity returns sales-gap fields; full returns all |
| `countOnly` | `boolean` | Preview stored in COUNT_SUMMARY without per-result charges. Actor start and platform usage may still apply. Counts matching segment rows; the same domain may occur in multiple segm |
| `maxItems` | `integer` | Upper limit across all data segments. AI/MCP calls should normally request 5–50 rows; bulk exports can request up to 250000 and paginate with offset. |
| `offset` | `integer` | Skip the first N matching rows, then return the next batch. Use it to export more than one run allows: run 1 with Offset 0, run 2 with Offset = the rows you already got, and so on. |
| `columns` | `array` | Optional exact field list. When provided, it overrides Output detail. Leave empty to use outputPreset; each website remains one result row. |

## Pricing

The package is free. Actor runs are billed by Apify using the pricing shown on the [Actor page](https://apify.com/apivault_labs/tech-stack-lookup); platform usage may also apply.

## Resources

- [Actor and live input schema](https://apify.com/apivault_labs/tech-stack-lookup)
- [Source repository](https://github.com/apivault-labs/n8n-nodes-apivault-tech-stack-lookup)
- [n8n community-node documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT. The hosted Actor is a separate paid service governed by Apify terms.
