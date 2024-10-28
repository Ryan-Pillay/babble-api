import axios from 'axios';

export async function POST(req) {
  try {
    const {
      currency,
      type, // Example: 'sort_code'
      accountHolderName,
      ownedByCustomer = false,
      profile = process.env.WISE_PROFILE_ID,
      details, // Contains legalType, sortCode, accountNumber, and dateOfBirth
    } = await req.json();

    // Construct the request payload
    const requestBody = {
      currency,
      type,
      profile, // Personal or business profile ID
      ownedByCustomer,
      accountHolderName,
      details,
    };

    // Send request to Wise API
    const response = await axios.post(
      `${process.env.WISE_SANDBOX}/v1/accounts`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.WISE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error creating recipient:', error.response?.data || error.message);
    return new Response(
      JSON.stringify({ error: error.response?.data || 'Something went wrong' }),
      { status: 500 }
    );
  }
}
