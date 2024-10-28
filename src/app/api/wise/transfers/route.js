// app/api/wise/transfers/route.js

/**
 * What it does: Creates the transfer using the recipient and quote details.
 * When to call: Call this after the quote is created.
 */
import axios from 'axios';

export async function POST(req) {
  const { targetAccount, quoteId, reference } = await req.json();

  try {
    const response = await axios.post(
      'https://api.wise.com/v1/transfers',
      {
        targetAccount,
        quoteUuid: quoteId,
        customerTransactionId: reference,
        details: { reference },
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
