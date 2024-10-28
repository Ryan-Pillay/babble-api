// app/api/wise/quotes/route.js

/**
 * What it does: Returns the estimated fees and exchange rates for the transfer.
 * When to call: Call this after creating a recipient.
 */
import axios from 'axios';

export async function POST(req) {
  const { sourceCurrency, targetCurrency, amount } = await req.json();

  try {
    const response = await axios.post(
      'https://api.wise.com/v2/quotes',
      {
        sourceCurrency,
        targetCurrency,
        sourceAmount: amount,
        profile: process.env.WISE_PROFILE_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WISE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
