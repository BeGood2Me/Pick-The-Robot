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
        'Vendor-neutral robot matcher for warehouse, cleaning, and restaurant operators. ' +
        'Rules-based scoring only. Vendor clicks must use returned clickUrl values. ' +
        'All endpoints require a valid API key.',
    },
    servers: [{ url: `${server}/api/v1` }],
    tags: [
      { name: 'match', description: 'Run the matcher' },
      { name: 'vendors', description: 'Browse the vendor catalog' },
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
      },
    },
    paths: {
      '/match': {
        post: {
          tags: ['match'],
          summary: 'Generate a robot recommendation',
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
