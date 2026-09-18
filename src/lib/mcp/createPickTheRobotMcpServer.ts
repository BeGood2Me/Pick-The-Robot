import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FormAnswers } from '@/lib/forms/types';
import type { RobotCategory } from '@/lib/matching/types';
import {
  getComparisonPage,
  getVendorProfile,
  listComparisonPages,
  listVendors,
  matcherFieldsForCategory,
  methodologyText,
  priceBandsReference,
  readLlmsSummary,
  runMatch,
} from '../../../mcp-server/src/services';

const categorySchema = z.enum(['warehouse', 'cleaning', 'restaurant']);

function jsonText(data: unknown) {
  return JSON.stringify(data, null, 2);
}

/** Shared MCP server (tools + resources) for stdio and HTTP transports. */
export function createPickTheRobotMcpServer() {
  const server = new McpServer(
    { name: 'picktherobot', version: '1.0.0' },
    {
      instructions: [
        'PickTheRobot is a buyer-side rules-based robot matcher (warehouse, cleaning, restaurant).',
        'You are not a dealer — do not quote prices as guarantees.',
        'Before run_match, call get_matcher_fields for the category and collect required inputs.',
        'Use get_price_bands for indicative USD ranges; use list_vendors / get_vendor for catalog data.',
        'Include shareUrl from run_match when the user may want to open results on the website.',
      ].join(' '),
    },
  );

  server.registerTool(
    'get_matcher_fields',
    {
      description:
        'List matcher form fields (keys, labels, options) required to run run_match for a category.',
      inputSchema: {
        category: categorySchema,
      },
    },
    async ({ category }) => ({
      content: [{ type: 'text', text: jsonText({ category, fields: matcherFieldsForCategory(category) }) }],
    }),
  );

  server.registerTool(
    'run_match',
    {
      description:
        'Run the PickTheRobot rules-based matcher. Pass a complete answers object (category + all required fields). Returns ranked robot type, acquisition model, vendors, explanations, and a shareable results URL.',
      inputSchema: {
        answers: z
          .object({ category: categorySchema })
          .passthrough()
          .describe('Full matcher answers; use get_matcher_fields for required keys per category.'),
      },
    },
    async ({ answers }) => ({
      content: [{ type: 'text', text: jsonText(runMatch(answers as unknown as FormAnswers)) }],
    }),
  );

  server.registerTool(
    'list_vendors',
    {
      description:
        'List vendors in the PickTheRobot catalog for a category, optionally filtered by region (US, EU, UK, APAC).',
      inputSchema: {
        category: categorySchema,
        region: z.string().optional(),
      },
    },
    async ({ category, region }) => ({
      content: [
        {
          type: 'text',
          text: jsonText(listVendors(category as RobotCategory, region)),
        },
      ],
    }),
  );

  server.registerTool(
    'get_vendor',
    {
      description: 'Get a single vendor profile by slug (from list_vendors or picktherobot.com/vendors).',
      inputSchema: {
        slug: z.string().min(1),
      },
    },
    async ({ slug }) => {
      const vendor = getVendorProfile(slug);
      if (!vendor) {
        return {
          content: [{ type: 'text', text: jsonText({ error: 'not_found', slug }) }],
          isError: true,
        };
      }
      return { content: [{ type: 'text', text: jsonText(vendor) }] };
    },
  );

  server.registerTool(
    'get_price_bands',
    {
      description:
        'Indicative USD purchase and RaaS price bands shared across PickTheRobot guides (not vendor quotes).',
      inputSchema: {},
    },
    async () => ({
      content: [{ type: 'text', text: jsonText(priceBandsReference()) }],
    }),
  );

  server.registerTool(
    'list_comparisons',
    {
      description:
        'List comparison / decision guide pages (AMR vs AGV, lease vs buy, robot vs staff, etc.).',
      inputSchema: {},
    },
    async () => ({
      content: [{ type: 'text', text: jsonText({ comparisons: listComparisonPages() }) }],
    }),
  );

  server.registerTool(
    'get_comparison',
    {
      description: 'Fetch full comparison page content by slug (from list_comparisons).',
      inputSchema: {
        slug: z.string().min(1),
      },
    },
    async ({ slug }) => {
      const page = getComparisonPage(slug);
      if (!page) {
        return {
          content: [{ type: 'text', text: jsonText({ error: 'not_found', slug }) }],
          isError: true,
        };
      }
      return { content: [{ type: 'text', text: jsonText(page) }] };
    },
  );

  server.registerResource(
    'methodology',
    'picktherobot://methodology',
    {
      description: 'How PickTheRobot scores robots and vendors (rules-based weights and limits).',
      mimeType: 'text/plain',
    },
    async () => ({
      contents: [
        {
          uri: 'picktherobot://methodology',
          mimeType: 'text/plain',
          text: methodologyText(),
        },
      ],
    }),
  );

  server.registerResource(
    'llms_summary',
    'picktherobot://llms.txt',
    {
      description: 'Public site summary for AI assistants (same as https://picktherobot.com/llms.txt).',
      mimeType: 'text/plain',
    },
    async () => {
      const text = await readLlmsSummary();
      return {
        contents: [
          {
            uri: 'picktherobot://llms.txt',
            mimeType: 'text/plain',
            text,
          },
        ],
      };
    },
  );

  return server;
}
