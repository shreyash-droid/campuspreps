import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Test environment variables
    const envCheck = {
      EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing',
      RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL ? 'Set' : 'Missing'
    };

    console.log('Environment variables check:', envCheck);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({
        success: false,
        error: 'Email credentials not configured',
        envCheck
      }, { status: 500 });
    }

    // Test SMTP connection
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

    try {
      await transporter.verify();
      console.log('SMTP connection test successful');
      
      return NextResponse.json({
        success: true,
        message: 'Email configuration is working correctly',
        envCheck,
        smtpTest: 'Passed'
      });
    } catch (smtpError) {
      console.error('SMTP test failed:', smtpError);
      
      return NextResponse.json({
        success: false,
        error: 'SMTP connection failed',
        details: smtpError.message,
        envCheck,
        smtpTest: 'Failed'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Test email endpoint error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error.message
    }, { status: 500 });
  }
}