const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST and OPTIONS methods
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'OPTIONS') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Allow': 'POST, OPTIONS'
      },
      body: 'Method Not Allowed'
    };
  }

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    };
  }

  try {
    // Forward the request to n8n
    const response = await fetch('https://goodbytes.app.n8n.cloud/webhook/f406671e-c954-4691-b39a-66c90aa2f103/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: event.body
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to proxy request' })
    };
  }
};
