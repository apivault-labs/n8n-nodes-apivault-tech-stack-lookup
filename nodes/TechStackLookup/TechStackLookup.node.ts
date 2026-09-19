import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const ACTOR_ID = 'apivault_labs~tech-stack-lookup';

export class TechStackLookup implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BuiltWith Alternative — Tech Stack Leads & Lookup (60M)',
		name: 'techStackLookup',
		icon: 'file:techstacklookup.svg',
		group: ['transform'],
		version: 1,
		description: 'Technology leads and tech stack lookup across 60M+ websites. BuiltWith alternative to find websites by technology, check domains, discover Shopify and Klaviyo leads, build lookalike audiences and monitor stack changes. AI/MCP-ready output for B2B sales.',
		defaults: { name: 'BuiltWith Alternative — Tech Stack Leads & Lookup (60M)' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'apifyApi', required: true }],
		properties: [
   {
      "displayName": "🔀 What do you want to do?",
      "name": "mode",
      "description": "find requires technologies, technologyPreset or opportunityPreset; detect requires domains; lookalike requires seed domains; monitor requires domains and a stable monitorName; catalog needs no other input.",
      "type": "options",
      "options": [
         {
            "name": "🔎 Find websites by technology",
            "value": "find"
         },
         {
            "name": "🧰 Check the tech stack of my domains",
            "value": "detect"
         },
         {
            "name": "🧬 Find lookalike companies",
            "value": "lookalike"
         },
         {
            "name": "🔔 Monitor technology changes",
            "value": "monitor"
         },
         {
            "name": "📚 Browse technology catalog",
            "value": "catalog"
         }
      ],
      "default": "find"
   },
   {
      "displayName": "🌐 Domains (Detect / Lookalike / Monitor only)",
      "name": "domains",
      "description": "Required when mode is detect, lookalike or monitor; ignored otherwise. Accepts hostnames or URLs. Unknown domains are skipped without a result charge. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "⚡ Popular technology preset",
      "name": "technologyPreset",
      "description": "Used only when mode=find. Optional shortcut combined with custom Technologies.",
      "type": "options",
      "options": [
         {
            "name": "Shopify",
            "value": "Shopify"
         },
         {
            "name": "Shopify Plus",
            "value": "Shopify Plus"
         },
         {
            "name": "WooCommerce",
            "value": "WooCommerce"
         },
         {
            "name": "WordPress",
            "value": "WordPress"
         },
         {
            "name": "Klaviyo",
            "value": "Klaviyo"
         },
         {
            "name": "HubSpot",
            "value": "HubSpot"
         },
         {
            "name": "Stripe",
            "value": "Stripe"
         },
         {
            "name": "PayPal",
            "value": "PayPal"
         },
         {
            "name": "Mailchimp",
            "value": "Mailchimp"
         },
         {
            "name": "Salesforce",
            "value": "Salesforce"
         },
         {
            "name": "Cloudflare",
            "value": "Cloudflare"
         },
         {
            "name": "Magento",
            "value": "Magento"
         },
         {
            "name": "BigCommerce",
            "value": "BigCommerce"
         },
         {
            "name": "Yotpo",
            "value": "Yotpo"
         },
         {
            "name": "Gorgias",
            "value": "Gorgias"
         }
      ],
      "default": "Shopify"
   },
   {
      "displayName": "🎯 Sales opportunity preset",
      "name": "opportunityPreset",
      "description": "Used only when mode=find. Returns matching leads, missing technology, opportunity score and suggested pitch.",
      "type": "options",
      "options": [
         {
            "name": "Shopify without Klaviyo",
            "value": "shopify_without_klaviyo"
         },
         {
            "name": "Klaviyo without Yotpo",
            "value": "klaviyo_without_yotpo"
         },
         {
            "name": "Mailchimp replacement prospects",
            "value": "mailchimp_replacement"
         },
         {
            "name": "WooCommerce migration prospects",
            "value": "woocommerce_migration"
         },
         {
            "name": "HubSpot without Klaviyo",
            "value": "hubspot_without_klaviyo"
         },
         {
            "name": "Stripe without PayPal",
            "value": "stripe_without_paypal"
         }
      ],
      "default": "shopify_without_klaviyo"
   },
   {
      "displayName": "✅ Technologies to include",
      "name": "technologies",
      "description": "Used only when mode=find. Enter complete product names such as Klaviyo, Stripe, Shopify Plus, HubSpot or Cloudflare. AI agents should prefer technologyPreset for one popular technology and technologies for custom or multiple values. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "🔗 Match logic",
      "name": "matchMode",
      "description": "Used only when mode=find. any = at least one technology (OR); all = every technology (AND).",
      "type": "options",
      "options": [
         {
            "name": "⚡ Any technology (OR)",
            "value": "any"
         },
         {
            "name": "🎯 Every technology (AND)",
            "value": "all"
         }
      ],
      "default": "any"
   },
   {
      "displayName": "🚫 Technologies to exclude",
      "name": "excludeTechnologies",
      "description": "Used only when mode=find. Exclude sites using any listed technology; e.g. Klaviyo leads without Yotpo. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "🧩 Technology category",
      "name": "category",
      "description": "Used only when mode=find. Limit matching to one stack layer; any is recommended because a product may appear in multiple layers.",
      "type": "options",
      "options": [
         {
            "name": "🌐 Any category (recommended)",
            "value": "any"
         },
         {
            "name": "🛒 Ecommerce platforms",
            "value": "ecommerce"
         },
         {
            "name": "📝 CMS & website builders",
            "value": "cms"
         },
         {
            "name": "🤝 CRM platforms",
            "value": "crm"
         },
         {
            "name": "📣 Marketing automation",
            "value": "marketing"
         },
         {
            "name": "💳 Payment tools",
            "value": "payments"
         },
         {
            "name": "☁️ Hosting providers",
            "value": "hosting"
         },
         {
            "name": "🤖 AI tools",
            "value": "ai"
         }
      ],
      "default": "any"
   },
   {
      "displayName": "🌍 Countries (ISO-2)",
      "name": "country",
      "description": "One or more ISO-2 country codes, e.g. US, DE, GB. Type each code and press Enter. Empty — no country filter. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "🏷️ Industry / vertical",
      "name": "vertical",
      "description": "Keep only sites in this industry, e.g. Fashion, Technology, Health, or Food. Leave empty to include every industry.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "📧 Only websites with email",
      "name": "hasEmail",
      "description": "Keep only sites where the Emails field is not empty.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "📞 Only websites with phone",
      "name": "hasPhone",
      "description": "Keep only sites where the Telephones field is not empty.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "🆕 First indexed within days",
      "name": "newWithinDays",
      "description": "Return websites first added to the index within the last N days. Use 7 for a weekly new-lead feed. Set 0 to disable.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 3650
      }
   },
   {
      "displayName": "🔄 Re-indexed within days",
      "name": "lastIndexedWithinDays",
      "description": "Keep websites whose record was indexed within the last N days. Useful for recently refreshed data. Set 0 to disable.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 3650
      }
   },
   {
      "displayName": "✅ Last confirmed within days",
      "name": "lastFoundWithinDays",
      "description": "Keep websites last observed within the previous N days. Use this to prefer recently confirmed leads. Set 0 to disable.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 3650
      }
   },
   {
      "displayName": "📊 Sort results by",
      "name": "sortBy",
      "description": "Order rows by this column before applying the limit, so you get the top leads instead of an arbitrary slice. Empty — no ordering.",
      "type": "options",
      "options": [
         {
            "name": "Overall Score",
            "value": "Overall Score"
         },
         {
            "name": "Tranco",
            "value": "Tranco"
         },
         {
            "name": "Page Rank",
            "value": "Page Rank"
         },
         {
            "name": "Sales Revenue",
            "value": "Sales Revenue"
         },
         {
            "name": "Employees",
            "value": "Employees"
         },
         {
            "name": "Technology Spend",
            "value": "Technology Spend"
         },
         {
            "name": "SKU",
            "value": "SKU"
         },
         {
            "name": "Performance",
            "value": "Performance"
         },
         {
            "name": "SEO",
            "value": "SEO"
         },
         {
            "name": "First Indexed",
            "value": "First Indexed"
         },
         {
            "name": "Last Indexed",
            "value": "Last Indexed"
         },
         {
            "name": "Last Found",
            "value": "Last Found"
         }
      ],
      "default": "Overall Score"
   },
   {
      "displayName": "⬇️ Highest values first",
      "name": "sortDesc",
      "description": "Highest values first (recommended for scores/traffic/revenue).",
      "type": "boolean",
      "default": true
   },
   {
      "displayName": "🧹 Remove duplicate domains",
      "name": "dedupeByDomain",
      "description": "Return each normalized Root Domain only once across all data segments. Recommended for lead exports.",
      "type": "boolean",
      "default": true
   },
   {
      "displayName": "📋 Output detail",
      "name": "outputPreset",
      "description": "essential is recommended for AI and most lead exports; contacts returns contact fields; tech_stack returns technology fields; opportunity returns sales-gap fields; full returns all source and derived fields. Ignored when columns is provided.",
      "type": "options",
      "options": [
         {
            "name": "Recommended — essential lead fields",
            "value": "essential"
         },
         {
            "name": "Contacts only",
            "value": "contacts"
         },
         {
            "name": "Technology stack",
            "value": "tech_stack"
         },
         {
            "name": "Sales opportunity",
            "value": "opportunity"
         },
         {
            "name": "Full export — all fields",
            "value": "full"
         }
      ],
      "default": "essential"
   },
   {
      "displayName": "🔢 Preview audience size only",
      "name": "countOnly",
      "description": "Preview stored in COUNT_SUMMARY without per-result charges. Actor start and platform usage may still apply. Counts matching segment rows; the same domain may occur in multiple segments, so this is an upper bound for unique websites.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "📦 Maximum websites (5–50 for AI)",
      "name": "maxItems",
      "description": "Upper limit across all data segments. AI/MCP calls should normally request 5–50 rows; bulk exports can request up to 250000 and paginate with offset.",
      "type": "number",
      "default": 50,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 250000
      }
   },
   {
      "displayName": "➡️ Offset (skip first N)",
      "name": "offset",
      "description": "Skip the first N matching rows, then return the next batch. Use it to export more than one run allows: run 1 with Offset 0, run 2 with Offset = the rows you already got, and so on. Set a Sort by column for stable pagination.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "🗂️ Custom output columns (optional)",
      "name": "columns",
      "description": "Optional exact field list. When provided, it overrides Output detail. Leave empty to use outputPreset; each website remains one result row. (comma or new-line separated)",
      "type": "string",
      "default": ""
   }
],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			try {
				const body: Record<string, unknown> = {};
				body["mode"] = this.getNodeParameter("mode", i);
				{ const _v = this.getNodeParameter("domains", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["domains"] = _a; }
				body["technologyPreset"] = this.getNodeParameter("technologyPreset", i);
				body["opportunityPreset"] = this.getNodeParameter("opportunityPreset", i);
				{ const _v = this.getNodeParameter("technologies", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["technologies"] = _a; }
				body["matchMode"] = this.getNodeParameter("matchMode", i);
				{ const _v = this.getNodeParameter("excludeTechnologies", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["excludeTechnologies"] = _a; }
				body["category"] = this.getNodeParameter("category", i);
				{ const _v = this.getNodeParameter("country", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["country"] = _a; }
				body["vertical"] = this.getNodeParameter("vertical", i);
				body["hasEmail"] = this.getNodeParameter("hasEmail", i);
				body["hasPhone"] = this.getNodeParameter("hasPhone", i);
				body["newWithinDays"] = this.getNodeParameter("newWithinDays", i);
				body["lastIndexedWithinDays"] = this.getNodeParameter("lastIndexedWithinDays", i);
				body["lastFoundWithinDays"] = this.getNodeParameter("lastFoundWithinDays", i);
				body["sortBy"] = this.getNodeParameter("sortBy", i);
				body["sortDesc"] = this.getNodeParameter("sortDesc", i);
				body["dedupeByDomain"] = this.getNodeParameter("dedupeByDomain", i);
				body["outputPreset"] = this.getNodeParameter("outputPreset", i);
				body["countOnly"] = this.getNodeParameter("countOnly", i);
				body["maxItems"] = this.getNodeParameter("maxItems", i);
				body["offset"] = this.getNodeParameter("offset", i);
				{ const _v = this.getNodeParameter("columns", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["columns"] = _a; }
				const options: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://api.apify.com/v2/acts/${ACTOR_ID}/runs`,
					body,
					json: true,
				};
				const started = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', options);
				const runId = started?.data?.id;
				if (!runId) throw new NodeOperationError(this.getNode(), 'Apify did not return a run ID', { itemIndex: i });
				let run = started.data;
				const deadline = Date.now() + 60 * 60 * 1000;
				while (!['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(run.status)) {
					if (Date.now() >= deadline) throw new NodeOperationError(this.getNode(), 'Waiting timed out; check the existing run in Apify before retrying', { itemIndex: i });
					const polled = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', { method: 'GET', url: `https://api.apify.com/v2/actor-runs/${runId}?waitForFinish=20`, json: true });
					run = polled.data;
				}
				if (run.status !== 'SUCCEEDED') throw new NodeOperationError(this.getNode(), 'Apify run ended with status ' + run.status, { itemIndex: i });
				let offset = 0;
				while (true) {
					const page = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', { method: 'GET', url: `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?clean=1&limit=1000&offset=${offset}`, json: true });
					if (!Array.isArray(page)) throw new NodeOperationError(this.getNode(), 'Unexpected Dataset response', { itemIndex: i });
					for (const result of page) returnData.push({ json: result as IDataObject, pairedItem: { item: i } });
					offset += page.length;
					if (page.length < 1000) break;
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}
		return [returnData];
	}
}
