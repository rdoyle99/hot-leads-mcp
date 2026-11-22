#!/usr/bin/env node
'use strict';

const readline = require('readline');

const ENDPOINT = process.env.HOTLEADS_MCP_URL || 'https://hotleadsmcp.com/mcp';
const API_KEY = process.env.HOTLEADS_API_KEY || '';

const SERVER_INFO = {
  name: 'hot-leads-mcp',
  version: '1.0.0',
};

const TOOLS = [
  {
    name: 'search_leads',
    description:
      "Find people with a reason to buy this week: companies that raised money (SEC Form D and press), hired a new exec, launched, or are exhibiting at an upcoming trade show. Each row has the company, the named person, a checked email, what happened, the date, a source link and a suggested first line. Use it to build a cold-email or outreach list.",
    annotations: {
      title: 'Search Hot Leads',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    inputSchema: {
      type: 'object',
      properties: {
        signal: {
          type: 'string',
          enum: ['all', 'funding', 'new_exec', 'launch', 'exhibiting'],
          description: 'Which reason to buy. Default all.',
        },
        query: {
          type: 'string',
          description:
            "Keywords matched against company, industry, title, blurb and what happened, e.g. 'fintech', 'healthcare software', 'VP Marketing'.",
        },
        location: {
          type: 'string',
          description: "City or state text, e.g. 'Texas', 'CA', 'New York'.",
        },
        since: {
          type: 'string',
          description: 'Only rows on or after this date, YYYY-MM-DD.',
        },
        limit: {
          type: 'number',
          description: 'Max rows, default 50, max 500.',
        },
      },
    },
  },
  {
    name: 'feed_info',
    description: 'When the Hot Leads feed was last updated and how many rows of each signal it has.',
    annotations: {
      title: 'Hot Leads Feed Info',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

async function handleMessage(msg) {
  if (!msg || typeof msg !== 'object') return;
  const { id, method, params } = msg;

  // Notifications have no id and expect no response
  if (id === undefined || id === null) return;

  if (method === 'initialize') {
    const requestedVersion = params?.protocolVersion || '2025-03-26';
    const supported = ['2025-06-18', '2025-03-26', '2024-11-05'];
    const protocolVersion = supported.includes(requestedVersion) ? requestedVersion : '2025-03-26';
    return send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
        instructions:
          'Hot Leads MCP: daily B2B companies with a reason to buy this week. Call search_leads with signal, query, and location, or call feed_info for live signal counts.',
      },
    });
  }

  if (method === 'ping') {
    return send({ jsonrpc: '2.0', id, result: {} });
  }

  if (method === 'tools/list') {
    return send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
  }

  if (method === 'resources/list') {
    return send({ jsonrpc: '2.0', id, result: { resources: [] } });
  }

  if (method === 'prompts/list') {
    return send({ jsonrpc: '2.0', id, result: { prompts: [] } });
  }

  if (method === 'tools/call') {
    if (!API_KEY) {
      return send({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: 'Set HOTLEADS_API_KEY in your MCP environment (or connect via https://hotleadsmcp.com/mcp?key=YOUR_KEY). Get a key or browse free sample tables at https://hotleadsmcp.com',
            },
          ],
          isError: true,
        },
      });
    }
    try {
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      };
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
      });
      const data = await res.json();
      return send({
        jsonrpc: '2.0',
        id,
        ...(data.error ? { error: data.error } : { result: data.result }),
      });
    } catch (err) {
      return send({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: `Error reaching ${ENDPOINT}: ${err.message}` }],
          isError: true,
        },
      });
    }
  }

  return send({
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  });
}

const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const parsed = JSON.parse(trimmed);
    handleMessage(parsed);
  } catch {
    send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
  }
});
