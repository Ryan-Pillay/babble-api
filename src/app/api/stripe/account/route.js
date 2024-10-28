import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    const { email } = await req.json(); // Get email from request body

    const account = await stripe.accounts.create({
      type: "express", // Using Express account type
      country: "US", // Set based on your country
      email,
      capabilities: {
        transfers: { requested: true }, // Allow payouts to users
      },
    });

    return NextResponse.json({ accountId: account.id });
  } catch (error) {
    console.error("Error creating connected account:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
