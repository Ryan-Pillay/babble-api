// app/api/wise/transfer-status/route.js

/**
 * What it does: Checks the current status of the transfer.
 * When to call: Call this periodically until the transfer is marked as complete.
 */
import axios from 'axios';

export async function GET(req) {
  const transferId = req.nextUrl.searchParams.get('transferId');

  try {
    const response = await axios.get(
      `https://api.wise.com/v1/transfers/${transferId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WISE_API_KEY}`,
        },
      }
    );

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
