import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Verify reCAPTCHA
    const captchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${data.captchaToken}`,
      }
    );
    const captchaData = await captchaRes.json();
    console.log("reCAPTCHA verification response:", captchaData);

    // Skip CAPTCHA enforcement on localhost (browser-error is a known local dev issue)
    const isDev = process.env.NODE_ENV === "development";

    if (!isDev && (!captchaData.success || captchaData.score < 0.5)) {
      return NextResponse.json(
        { error: "Failed CAPTCHA verification" },
        { status: 400 }
      );
    }

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
    if (isDev) {
      console.log("Received data:", JSON.stringify(data));

      // After sheets response
      console.log("Sheets status:", sheetsResponse.status);
      const sheetsText = await sheetsResponse.text();
      console.log("Sheets response:", sheetsText);
    }
    if (!sheetsResponse.ok) {
      throw new Error("Failed to update Google Sheets");
    }

    // 2. Send email notification (if webhook configured)
    // Replace the emailData block and fetch call with this:
    if (EMAIL_WEBHOOK_URL) {
      const emailPayload = {
        barangayName: data.barangayName,
        officialName: data.officialName,
        email: data.email,
        phone: data.phone,
        numberOfResidents: data.numberOfResidents || "Not specified",
        preferredDate: data.preferredDate || "Flexible",
        preferredTime: data.preferredTime || "Flexible",
        message: data.message || "",
        submittedAt: new Date(data.submittedAt).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: 'Asia/Manila'
        }),
      };

      try {
        await fetch(EMAIL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
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