// app/api/wise/fund-transfer/route.js

/**
 * What it does: Funds the transfer to complete the payout process.
 * When to call: Call this after the transfer is created.
 */
import axios from 'axios';

export async function POST(req) {
  const { transferId } = await req.json();

  try {
    const response = await axios.post(
      `https://api.wise.com/v3/profiles/${process.env.WISE_PROFILE_ID}/transfers/${transferId}/payments`,
      {},
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
