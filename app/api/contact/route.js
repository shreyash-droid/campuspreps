import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(req) {
  console.log('Contact form submission received');
  
  try {
    // Validate environment variables at runtime
    const requiredEnvVars = {
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS,
      RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL
    };

    console.log('Environment check:', {
      EMAIL_USER: requiredEnvVars.EMAIL_USER ? 'Set' : 'Missing',
      EMAIL_PASS: requiredEnvVars.EMAIL_PASS ? 'Set' : 'Missing',
      RECIPIENT_EMAIL: requiredEnvVars.RECIPIENT_EMAIL ? 'Set' : 'Missing'
    });

    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        console.error(`${key} is not set in environment variables`);
        return NextResponse.json(
          { 
            success: false,
            error: 'Server configuration error',
            details: `Missing environment variable: ${key}` 
          }, 
          { status: 500 }
        );
      }
    }

    // Parse and validate request body
    let requestData;
    try {
      requestData = await req.json();
      console.log('Request data received:', requestData);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid request format',
        details: 'Request body must be valid JSON'
      }, { status: 400 });
    }

    const { name, email, subject, message } = requestData;

    // Validate required fields
    const missingFields = [];
    if (!name || name.trim() === '') missingFields.push('name');
    if (!email || email.trim() === '') missingFields.push('email');
    if (!subject || subject.trim() === '') missingFields.push('subject');
    if (!message || message.trim() === '') missingFields.push('message');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        details: 'All fields are required'
      }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json({
        success: false,
        error: 'Invalid email format',
        details: 'Please provide a valid email address'
      }, { status: 400 });
    }

    console.log('Creating nodemailer transporter...');

    // Create transporter with more specific configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json({
        success: false,
        error: 'Email service configuration error',
        details: 'Unable to connect to email service'
      }, { status: 500 });
    }

    // Prepare email data
    const mailOptions = {
      from: `"Campus Preps Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      replyTo: email,
      subject: `Campus Preps Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #495057; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #212529;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
            <p>This email was sent from the Campus Preps contact form.</p>
            <p>Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission

        From: ${name} (${email})
        Subject: ${subject}

        Message:
        ${message}

        ---
        This email was sent from the Campus Preps contact form.
      `
    };

    console.log('Sending email...');

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    }, { status: 200 });
    
  } catch (error) {
    console.error('Detailed error sending email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });

    // Provide more specific error messages based on error type
    let userMessage = 'Failed to send message. Please try again.';
    let details = error.message;

    if (error.code === 'EAUTH') {
      userMessage = 'Email authentication failed. Please contact support.';
      details = 'Invalid email credentials';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      userMessage = 'Unable to connect to email service. Please try again later.';
      details = 'Network connection error';
    } else if (error.code === 'EMESSAGE') {
      userMessage = 'Invalid message format. Please check your input.';
      details = 'Message formatting error';
    }

    return NextResponse.json({
      success: false,
      error: userMessage,
      details: details,
      code: error.code || 'UNKNOWN_ERROR'
    }, { status: 500 });
  }
}