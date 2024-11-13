// app/api/agora/generateToken/route.js
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

export async function POST(request) {
  const { channelName, role = "publisher", uid = 0 } = await request.json();

  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE; // Make sure this is in your .env file
  const expirationTimeInSeconds = 86400; // 24 hours in seconds

  if (!appID || !appCertificate || !channelName) {
    return new Response(JSON.stringify({ error: "Missing required parameters or environment variables." }), {
      status: 400,
    });
  }

  const agoraRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTimestamp = currentTimestamp + expirationTimeInSeconds;

  // Generate the token
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    agoraRole,
    privilegeExpireTimestamp
  );

  if (!token) {
    return new Response(JSON.stringify({ error: "Token generation failed." }), { status: 500 });
  }

  return new Response(JSON.stringify({ token }), { status: 200 });
}
