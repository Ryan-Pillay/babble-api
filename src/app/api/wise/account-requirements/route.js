// app/api/account-requirements/route.js

import axios from 'axios';

export async function GET(request) {
  // Parse URL parameters
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'EUR';
  const target = searchParams.get('target') || 'USD';
  const sourceAmount = searchParams.get('sourceAmount') || 1000; // default to 1000 if not provided

  // Check if sourceAmount is provided
  if (!sourceAmount) {
    return new Response(JSON.stringify({ message: 'sourceAmount is required' }), { status: 400 });
  }

  try {
    // Make the request to the Wise API
    const response = await axios.get(`${process.env.WISE_SANDBOX}/v1/account-requirements`, {
      params: {
        source,
        target,
        sourceAmount,
      },
      headers: {
        'Authorization': `Bearer ${process.env.WISE_API_KEY}`, // Ensure this is set in your .env.local file
      },
    });

    // Return the response data
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error(error);
    // Handle errors appropriately
    if (error.response) {
      // If there's a response from Wise API, return it
      return new Response(JSON.stringify({ message: error.response.data }), { status: error.response.status });
    } else {
      // Fallback for other errors
      return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
  }
}
