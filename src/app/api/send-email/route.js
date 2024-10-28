import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail to send emails
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email address
    pass: process.env.EMAIL_PASSWORD, // App password for Gmail
  },
});

export async function POST(request) {
  try {
    const { requestedPayoutAmount, paymentLink, recipientEmail } = await request.json();

    if (!recipientEmail || !requestedPayoutAmount || !paymentLink) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: recipientEmail, requestedPayoutAmount, or paymentLink.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare the email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: ['babblechat.me@gmail.com', recipientEmail], // Two recipients
      subject: 'Payout Request Confirmation',
      html: `
        <h1>Payout Request Confirmation</h1>
        <p>Hello,</p>
        <p>We have received your payout request for <strong>$${requestedPayoutAmount} USD</strong>.</p>
        <p>We will use the following link to complete the payment:</p>
        <a href="${paymentLink}">${paymentLink}</a>
        <p>If you have any questions, feel free to reach out.</p>
        <p>Thank you!</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, message: 'Confirmation email sent successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
