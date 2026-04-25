import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // YOUR GOOGLE APPS SCRIPT WEB APP URL
    // Instructions to create this are in the accompanying SETUP.md file
    const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    // YOUR EMAIL SERVICE WEBHOOK (e.g., Make.com, n8n, or Zapier webhook)
    const EMAIL_WEBHOOK_URL = process.env.EMAIL_WEBHOOK_URL;

    if (!GOOGLE_SHEETS_WEBHOOK_URL) {
      console.error("Missing GOOGLE_SHEETS_WEBHOOK_URL");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // 1. Send to Google Sheets
    const sheetsResponse = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!sheetsResponse.ok) {
      throw new Error("Failed to update Google Sheets");
    }

    // 2. Send email notification (if webhook configured)
    if (EMAIL_WEBHOOK_URL) {
      const emailData = {
        to: process.env.NOTIFICATION_EMAIL || "your-email@example.com",
        subject: `🎯 New Demo Request: ${data.barangayName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: #0f766e; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: #fbbf24; margin: 0; font-size: 28px;">📋 New Demo Request</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #0f766e; margin-top: 0;">Barangay Information</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Barangay Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.barangayName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Official Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.officialName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Residents:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.numberOfResidents || "Not specified"}</td>
                </tr>
              </table>

              <h2 style="color: #0f766e; margin-top: 30px;">Preferred Demo Schedule</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Date:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.preferredDate || "Flexible"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Time:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.preferredTime || "Flexible"}</td>
                </tr>
              </table>

              ${data.message ? `
                <h2 style="color: #0f766e; margin-top: 30px;">Additional Notes</h2>
                <div style="background-color: #f0fdfa; padding: 15px; border-left: 4px solid #0f766e; border-radius: 4px; color: #1f2937;">
                  ${data.message}
                </div>
              ` : ''}

              <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #fbbf24;">
                <p style="margin: 0; color: #92400e; font-weight: bold;">⏰ Submitted at:</p>
                <p style="margin: 5px 0 0 0; color: #78350f;">${new Date(data.submittedAt).toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'short',
                  timeZone: 'Asia/Manila'
                })} (Philippine Time)</p>
              </div>

              <div style="margin-top: 30px; text-align: center;">
                <a href="mailto:${data.email}" 
                   style="display: inline-block; background-color: #0f766e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Reply to ${data.officialName}
                </a>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
              <p>This is an automated notification from e-Sumbong Demo Request System</p>
            </div>
          </div>
        `,
        text: `
New Demo Request from ${data.barangayName}

Contact Person: ${data.officialName}
Email: ${data.email}
Phone: ${data.phone}
Residents: ${data.numberOfResidents || "Not specified"}

Preferred Schedule:
Date: ${data.preferredDate || "Flexible"}
Time: ${data.preferredTime || "Flexible"}

${data.message ? `Additional Notes:\n${data.message}` : ''}

Submitted: ${new Date(data.submittedAt).toLocaleString()}
        `,
      };

      try {
        await fetch(EMAIL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailData),
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Demo request submitted successfully" 
    });

  } catch (error) {
    console.error("Error processing demo request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}