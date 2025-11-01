import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Validate environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'RECIPIENT_EMAIL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`${envVar} is not set in environment variables`);
    throw new Error(`${envVar} is not set in environment variables`);
  }
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
try {
  await transporter.verify();
  console.log('SMTP connection verified successfully');
} catch (error) {
  console.error('SMTP verification failed:', error);
  throw new Error('Failed to initialize email transport');
}

export async function POST(req) {
  console.log('Contact form submission received');
  try {
    // Validate request body
    if (!req.body) {
      return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
    }

    const { name, email, subject, message } = await req.json();

    // Prepare email data
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    // Create a proper JSON response
    const responseData = {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    };

    console.log('Sending success response:', responseData);

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response,
    });

    const errorResponse = {
      success: false,
      error: 'Failed to send message. Please try again.',
      details: error.message
    };

    console.log('Sending error response:', errorResponse);

    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}