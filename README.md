# n8n-nodes-startup-investors-api

An [n8n](https://n8n.io/) community node that searches a database of startup investors and returns structured firm records: name, website, focus areas, investment stages, and Crunchbase link. It is backed by the [Startup Investors API](https://apify.com/johnvc/startup-investors-data-scraper?fpr=9n7kx3) on [Apify](https://apify.com?fpr=9n7kx3) and bills per result, so there are no subscriptions and no minimums.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Output](#output) · [Example workflows](#example-workflows) · [Pricing](#pricing) · [Resources](#resources)

## What it does

Filter the investor database by firm type, focus area, stage, country, or keyword, and it returns one item per firm with the name, website, description, focus areas, stages, and Crunchbase link. It also works as an **AI Agent tool**, so an agent can find relevant investors on demand.

- Filter by firm type, focus area, investment stage, country, and keyword
- Optionally include investor contact details
- Sort and page through results
- Choose how much data to return per firm: Simplified, Raw, or Selected Fields

## Installation

Follow the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. In n8n, open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-startup-investors-api` as the npm package name.
4. Agree to the risks of using community nodes, then select **Install**.

After it installs, the **Startup Investors** node appears in the nodes panel.

> n8n Cloud only allows verified community nodes. Until this node is verified, install it on a self-hosted n8n instance.

## Credentials

You need a free [Apify account](https://apify.com?fpr=9n7kx3) and an API token.

1. Sign in to the [Apify Console](https://console.apify.com?fpr=9n7kx3).
2. Open **Settings > Integrations** and copy your **Personal API token**.
3. In n8n, create a new **Apify API** credential and paste the token.
4. Use the credential's **Test** button to confirm it works.

The node also supports **Apify OAuth2** if you prefer to connect that way.

## Operations

**Investor > Search** returns investor firms that match your filters.

| Parameter | Description |
| --- | --- |
| Keyword | Free-text keyword to match firm names and descriptions. |
| Firm Types | Comma-separated firm types, for example `Angel Investor, Venture Capital`. |
| Focus Areas | Comma-separated industries or focus areas. |
| Investment Stages | Comma-separated stages, for example `Seed, Series A`. |
| Countries | Comma-separated countries. |
| Maximum Results | How many firms to return. |
| Include Investor Contacts | Include contact details (billed separately). |
| Order By / Order Direction | Sort field and direction. |
| Output | How much data to return: Simplified, Raw, or Selected Fields. |

## Output

Each firm is returned as its own n8n item. The API returns more than ten fields per firm, so the **Output** parameter lets you choose how much to return:

- **Simplified** (default): a compact object with `firmName`, `website`, `crunchbaseUrl`, `description`, `focus`, `stages`, `aum`, and `firmId`. This mode is also used automatically when the node runs as an AI Agent tool, to keep responses small.
- **Raw**: every field the API returns for each firm, using the original field names below.
- **Selected Fields**: pick exactly which fields to include.

### Fields (Raw and Selected Fields)

| Field | Type | Description |
| --- | --- | --- |
| `firm_id` | integer | Unique firm identifier |
| `firm_type_id` | string | Firm type code |
| `firm_name` | string | Firm or investor name |
| `firm_website` | string | Firm website URL |
| `crunchbase_url` | string | Crunchbase profile URL |
| `firm_description` | string | Description of the firm |
| `firm_stages` | array | Investment stages the firm participates in |
| `firm_aum` | number | Assets under management, when known |
| `firm_focus` | array | Focus areas |
| `industry_names` | array | Industry labels |
| `last_checked` | string | When the record was last verified (ISO 8601) |
| `created_at` | string | When the record was created (ISO 8601) |
| `updated_at` | string | When the record was last updated (ISO 8601) |

## Example workflows

### 1. Build a target investor list

1. **Manual Trigger**.
2. **Startup Investors**: Focus Areas `Health Care`, Investment Stages `Seed, Series A`, Output `Simplified`.
3. **Google Sheets**: append each firm's `firmName`, `website`, and `crunchbaseUrl`.

### 2. Keyword-based investor research

1. **Manual Trigger**.
2. **Startup Investors**: Keyword `climate`, Maximum Results `200`.
3. **Filter**: keep firms whose `stages` include your round.

### 3. Let an AI Agent find investors

1. **AI Agent** node.
2. Attach **Startup Investors** as a tool.
3. Ask "Find seed-stage fintech investors in the US." The agent calls the node (in Simplified mode) and answers with matching firms.

## Pricing

This node calls the [Startup Investors API](https://apify.com/johnvc/startup-investors-data-scraper?fpr=9n7kx3) on Apify, which is billed **pay-per-result**: about **$0.04 per firm returned** (plus a small per-run fee, and an extra charge per contact when contacts are included), with no subscription and no minimums. Apify also includes a free monthly usage tier that covers typical volumes. See the [Actor page](https://apify.com/johnvc/startup-investors-data-scraper?fpr=9n7kx3) for current rates.

## Resources

- [Startup Investors API on Apify](https://apify.com/johnvc/startup-investors-data-scraper?fpr=9n7kx3)
- [npm package](https://www.npmjs.com/package/n8n-nodes-startup-investors-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify n8n integration guide](https://docs.apify.com/platform/integrations/n8n)

## License

[MIT](LICENSE.md)
