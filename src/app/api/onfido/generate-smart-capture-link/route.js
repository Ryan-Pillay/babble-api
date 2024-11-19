// app/api/onfido/generate-smart-capture-link/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

const ONFIDO_API_URL = 'https://api.eu.onfido.com/v3.5'; // EU endpoint, adjust if you're in a different region
const ONFIDO_API_TOKEN = process.env.ONFIDO_API_TOKEN;

export async function POST(request) {
  try {
    const { applicant_id, workflow_id, completed_redirect_url, expired_redirect_url, expires_at, language } = await request.json();

    // Validate input
    if (!applicant_id || !workflow_id) {
      return NextResponse.json(
        { error: 'applicant_id and workflow_id are required' },
        { status: 400 }
      );
    }

    // Prepare the link object
    const link = {
      completed_redirect_url,
      expired_redirect_url,
      expires_at,
      language,
    };

    // Call the Onfido API to create the workflow run
    const response = await axios.post(
      `${ONFIDO_API_URL}/workflow_runs`,
      {
        workflow_id,
        applicant_id,
        link,
      },
      {
        headers: {
          Authorization: `Token token=${ONFIDO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the Smart Capture link URL from the Onfido API response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating Onfido Smart Capture link:', error.response?.data || error.message);

    const errorMessage = error.response?.data?.message || error.message;
    const errorCode = error.response?.status || 500;

    return NextResponse.json(
      { error: `Failed to create Onfido Smart Capture link: ${errorMessage}` },
      { status: errorCode }
    );
  }
}
