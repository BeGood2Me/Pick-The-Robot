import { API_TIER_LIMITS } from './tiers';

const RATE_LIMIT_HEADERS = {
  'X-RateLimit-Limit': { schema: { type: 'integer' }, description: 'Requests allowed per minute' },
  'X-RateLimit-Remaining': { schema: { type: 'integer' } },
  'X-RateLimit-Reset': { schema: { type: 'integer' }, description: 'Unix timestamp when the window resets' },
  'X-API-Tier': { schema: { type: 'string', enum: ['starter', 'pro'] } },
};

const MATCH_USAGE_HEADERS = {
  'X-Usage-Limit': { schema: { type: 'integer' }, description: 'Monthly match quota' },
  'X-Usage-Remaining': { schema: { type: 'integer' } },
  'X-Usage-Period': { schema: { type: 'string', example: '2026-08' } },
  'X-Usage-Used': { schema: { type: 'integer' } },
};

/** OpenAPI 3.1 description for the public PickTheRobot API. */
export function buildOpenApiDocument(baseUrl: string) {
  const server = baseUrl.replace(/\/$/, '');

  return {
    openapi: '3.1.0',
    info: {
      title: 'PickTheRobot API',
      version: '1.0.0',
      description:
        'Vendor-neutral robot matcher for home robot vacuums and for warehouse, commercial cleaning, and restaurant operators. ' +
        'Rules-based scoring only. Business vendor clicks must use returned clickUrl values; home product links may be affiliate. ' +
        'All endpoints require a valid API key. Home and business catalogs are separate — do not mix them.',
    },
    servers: [{ url: `${server}/api/v1` }],
    tags: [
      { name: 'match', description: 'Run the business matcher (warehouse, cleaning, restaurant)' },
      { name: 'home', description: 'Home robot vacuum matcher and product catalog' },
      { name: 'vendors', description: 'Browse the business vendor catalog' },
    ],
    components: {
      securitySchemes: {
        ApiKeyHeader: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
        BearerAuth: { type: 'http', scheme: 'bearer' },
      },
      schemas: {
        ApiError: {
          type: 'object',
          required: ['error', 'message'],
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            fields: { type: 'object', additionalProperties: { type: 'string' } },
            period: { type: 'string' },
            limit: { type: 'integer' },
            used: { type: 'integer' },
          },
        },
        RobotCategory: { type: 'string', enum: ['warehouse', 'cleaning', 'restaurant'] },
        MatchRequest: {
          type: 'object',
          required: ['category'],
          properties: {
            category: { $ref: '#/components/schemas/RobotCategory' },
            laborCostPerHour: { type: 'number' },
            hoursPerDay: { type: 'number' },
            daysPerWeek: { type: 'number' },
            staffingPressure: { type: 'string', enum: ['low', 'medium', 'high'] },
            budgetPreference: {
              type: 'string',
              enum: ['low_upfront', 'balanced', 'maximize_long_term_roi'],
            },
            acquisitionPreference: {
              type: 'string',
              enum: ['open', 'buy', 'lease', 'raas'],
            },
            techReadiness: { type: 'string', enum: ['low', 'medium', 'high'] },
            region: { type: 'string', example: 'US' },
            floorAreaSqM: { type: 'number', description: 'Cleaning category' },
            facilitySizeSqM: { type: 'number', description: 'Warehouse category' },
            seatsPerDay: { type: 'number', description: 'Restaurant category' },
          },
          description:
            'Flat JSON body with shared fields plus category-specific wizard answers. ' +
            'See scripts/api-samples/ for a complete cleaning example.',
        },
        PublicMatchResponse: {
          type: 'object',
          required: ['matchId', 'tier', 'category', 'bestRobotMatch', 'vendorMatches', 'attribution'],
          properties: {
            matchId: { type: 'string', format: 'uuid' },
            tier: { type: 'string', enum: ['starter', 'pro'] },
            category: { $ref: '#/components/schemas/RobotCategory' },
            matchConfidence: { type: 'string', enum: ['strong', 'moderate', 'weak'] },
            acquisitionRecommendation: { type: 'string' },
            bestRobotMatch: { type: 'object' },
            vendorMatches: { type: 'array', items: { type: 'object' } },
            cleaningRoi: { type: 'object', description: 'Cleaning category only' },
            fleetSizingHint: {
              type: 'string',
              description: 'Omitted when cleaningRoi is present',
            },
            attribution: {
              type: 'object',
              properties: {
                required: { type: 'boolean' },
                link: { type: 'string', format: 'uri' },
                text: { type: 'string' },
              },
            },
          },
          description: 'Tier-gated match payload. Pro includes additional fields beyond Starter.',
        },
        PublicVendorsResponse: {
          type: 'object',
          required: ['tier', 'category', 'count', 'vendors'],
          properties: {
            tier: { type: 'string', enum: ['starter', 'pro'] },
            category: { $ref: '#/components/schemas/RobotCategory' },
            region: { type: 'string' },
            count: { type: 'integer' },
            vendors: { type: 'array', items: { type: 'object' } },
          },
        },
        HomeMatchRequest: {
          type: 'object',
          required: [
            'floorMix',
            'homeSize',
            'pets',
            'hairLength',
            'mopNeeded',
            'budgetBand',
            'selfEmpty',
            'multiFloor',
            'obstacles',
          ],
          properties: {
            floorMix: { type: 'string', enum: ['hard', 'carpet', 'mixed'] },
            homeSize: { type: 'string', enum: ['small', 'medium', 'large'] },
            pets: { type: 'string', enum: ['none', 'cat', 'dog', 'both'] },
            hairLength: { type: 'string', enum: ['none', 'short', 'long'] },
            mopNeeded: { type: 'string', enum: ['no', 'nice_to_have', 'yes'] },
            budgetBand: {
              type: 'string',
              enum: ['under_300', '300_600', '600_1000', 'over_1000'],
            },
            selfEmpty: {
              type: 'string',
              enum: ['not_needed', 'preferred', 'required'],
            },
            multiFloor: { type: 'boolean' },
            obstacles: { type: 'string', enum: ['low', 'medium', 'high'] },
          },
          description:
            'Home robot-vacuum matcher inputs. Separate from business POST /match — never send warehouse fields here.',
        },
        PublicHomeMatchResponse: {
          type: 'object',
          required: [
            'matchId',
            'tier',
            'track',
            'bestClass',
            'productMatches',
            'shareUrl',
            'attribution',
          ],
          properties: {
            matchId: { type: 'string', format: 'uuid' },
            tier: { type: 'string', enum: ['starter', 'pro'] },
            track: { type: 'string', enum: ['home_vacuum'] },
            matchConfidence: { type: 'string', enum: ['strong', 'moderate', 'weak'] },
            bestClass: { type: 'string', enum: ['vacuum_only', 'mop_vac_combo'] },
            bestClassLabel: { type: 'string' },
            budgetLane: { type: 'string', enum: ['budget', 'mid', 'premium'] },
            summary: { type: 'string' },
            productMatches: { type: 'array', items: { type: 'object' } },
            shareUrl: { type: 'string', format: 'uri' },
            affiliateDisclosure: { type: 'string' },
            attribution: { type: 'object' },
          },
          description:
            'Tier-gated home vacuum match. Pro includes score breakdowns and more product cautions.',
        },
        PublicHomeProductsResponse: {
          type: 'object',
          required: ['tier', 'track', 'count', 'products'],
          properties: {
            tier: { type: 'string', enum: ['starter', 'pro'] },
            track: { type: 'string', enum: ['home_vacuum'] },
            class: { type: 'string', enum: ['vacuum_only', 'mop_vac_combo'] },
            count: { type: 'integer' },
            products: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    paths: {
      '/match': {
        post: {
          tags: ['match'],
          summary: 'Generate a business robot recommendation',
          description:
            'Warehouse, commercial cleaning, or restaurant only. For home robot vacuums use POST /home/match.',
          security: [{ ApiKeyHeader: [] }, { BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/MatchRequest' } },
            },
          },
          responses: {
            '200': {
              description: 'Match result',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PublicMatchResponse' } },
              },
              headers: { ...RATE_LIMIT_HEADERS, ...MATCH_USAGE_HEADERS },
            },
            '400': {
              description: 'Invalid JSON or validation error',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '401': {
              description: 'Invalid API key',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '422': {
              description: 'Match engine error',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '429': {
              description: 'Rate limit or monthly quota exceeded',
              headers: {
                'Retry-After': { schema: { type: 'integer' } },
                ...RATE_LIMIT_HEADERS,
                ...MATCH_USAGE_HEADERS,
              },
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
          },
        },
      },
      '/home/match': {
        post: {
          tags: ['home'],
          summary: 'Generate a home robot vacuum recommendation',
          description:
            'Rules-based home vacuum / vac+mop shortlist from floors, pets, mop, and budget. ' +
            'Separate catalog from business vendors. Counts against the same monthly match quota as POST /match.',
          security: [{ ApiKeyHeader: [] }, { BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/HomeMatchRequest' } },
            },
          },
          responses: {
            '200': {
              description: 'Home vacuum match result',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PublicHomeMatchResponse' },
                },
              },
              headers: { ...RATE_LIMIT_HEADERS, ...MATCH_USAGE_HEADERS },
            },
            '400': {
              description: 'Invalid JSON or validation error',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '401': {
              description: 'Invalid API key',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '422': {
              description: 'Match engine error',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '429': {
              description: 'Rate limit or monthly quota exceeded',
              headers: {
                'Retry-After': { schema: { type: 'integer' } },
                ...RATE_LIMIT_HEADERS,
                ...MATCH_USAGE_HEADERS,
              },
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
          },
        },
      },
      '/home/products': {
        get: {
          tags: ['home'],
          summary: 'List home robot vacuum products',
          description:
            'SKU catalog for home robot vacuums (not business vendors). Optional class filter.',
          security: [{ ApiKeyHeader: [] }, { BearerAuth: [] }],
          parameters: [
            {
              name: 'class',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['vacuum_only', 'mop_vac_combo'] },
            },
          ],
          responses: {
            '200': {
              description: 'Home product catalog slice',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PublicHomeProductsResponse' },
                },
              },
              headers: RATE_LIMIT_HEADERS,
            },
            '400': {
              description: 'Invalid class filter',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '401': {
              description: 'Invalid API key',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '429': {
              description: 'Rate limit exceeded',
              headers: {
                'Retry-After': { schema: { type: 'integer' } },
                ...RATE_LIMIT_HEADERS,
              },
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
          },
        },
      },
      '/vendors': {
        get: {
          tags: ['vendors'],
          summary: 'List vendors for a category',
          security: [{ ApiKeyHeader: [] }, { BearerAuth: [] }],
          parameters: [
            {
              name: 'category',
              in: 'query',
              required: true,
              schema: { $ref: '#/components/schemas/RobotCategory' },
            },
            {
              name: 'region',
              in: 'query',
              required: false,
              schema: { type: 'string', example: 'US' },
            },
          ],
          responses: {
            '200': {
              description: 'Vendor catalog slice',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PublicVendorsResponse' } },
              },
              headers: RATE_LIMIT_HEADERS,
            },
            '400': {
              description: 'Missing or invalid category',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '401': {
              description: 'Invalid API key',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
            '429': {
              description: 'Rate limit exceeded',
              headers: {
                'Retry-After': { schema: { type: 'integer' } },
                ...RATE_LIMIT_HEADERS,
              },
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
            },
          },
        },
      },
    },
    'x-tier-limits': API_TIER_LIMITS,
  };
}
