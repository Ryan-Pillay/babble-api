// app/api/onfido/create-applicant/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

const ONFIDO_API_URL = 'https://api.onfido.com/v3.5';
const ONFIDO_API_TOKEN = process.env.ONFIDO_API_TOKEN;

export async function POST(request) {
  try {
    const { first_name, last_name, address } = await request.json();

    // Validate required fields
    if (!first_name || !last_name || !address?.country) {
      return NextResponse.json(
        { error: 'first_name, last_name, and address with country are required' },
        { status: 400 }
      );
    }

    // Create the applicant in Onfido
    const response = await axios.post(
      `${ONFIDO_API_URL}/applicants`,
      {
        first_name,
        last_name,
        address,
      },
      {
        headers: {
          Authorization: `Token token=${ONFIDO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the newly created applicant's data (including applicant_id)
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating Onfido applicant:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to create applicant' },
      { status: 500 }
    );
  }
}
