import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    const { accountId } = await req.json(); // Get account ID from request

    const origin = req.headers.get("origin");

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
    //   return_url: `${origin}/return/${accountId}`, // Redirect after success
    //   refresh_url: `${origin}/refresh/${accountId}`, // Redirect if onboarding fails
      return_url: `http://localhost:3000/`, // Redirect after success
      refresh_url: `http://localhost:3000/`, // Redirect if onboarding fails
      type: "account_onboarding",
    });

    return NextResponse.json(accountLink);
  } catch (error) {
    console.error("Error creating account link:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
