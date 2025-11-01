import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  console.log('Contact form submission received');
  
  try {
    // Validate environment variables at runtime
    const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'RECIPIENT_EMAIL'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`${envVar} is not set in environment variables`);
        return NextResponse.json(
          { error: 'Server configuration error' }, 
          { status: 500 }
        );
      }
    }

    // Validate request body
    const { name, email, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

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

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('Error sending email:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to send message. Please try again.',
      details: error.message
    }, { status: 500 });
  }
}