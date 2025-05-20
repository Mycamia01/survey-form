// app/api/sendSurvey/route.js

import { sendEmail } from '../../../services/emailService';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, medium, surveyLink } = await req.json();

    // Validate required fields
    if (!email || !surveyLink) {
      return NextResponse.json(
        { success: false, message: "Email and surveyLink are required" },
        { status: 400 }
      );
    }

    // Only email is supported (per your original code)
    if (medium !== "email") {
      return NextResponse.json(
        { success: false, message: "Only email medium is supported" },
        { status: 400 }
      );
    }

    // Send via Brevo
    await sendEmail(
      email,
      name,
      "Plug N Play Global Survey Invitation", // Updated subject
      `
        <p>Hello ${name || 'there'},</p>
        <p>You've been invited to complete our survey:</p>
        <p><a href="${surveyLink}" style="color: #2563eb; text-decoration: underline;">Click here to begin survey</a></p>
        <p>Thank you for participating!</p>
        <p><strong>Plug N Play Global Team</strong></p>
      `
    );

    return NextResponse.json(
      { success: true, message: "Survey sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("SendSurvey Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to send survey",
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}