import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
 
const resend = new Resend(process.env.RESEND_API_KEY);
 
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://www.daniellamendozafit.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
 
const QUESTION_ORDER = [
  "Main Goal",
  "Age Range",
  "Fitness Level",
  "Biggest Motivation",
  "Openness to Coaching",
];
 
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, ...quizAnswers } = body as Record<string, string>;
 
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: CORS_HEADERS }
      );
    }
 
    const answerRows = QUESTION_ORDER.map((label) => {
      const answer = quizAnswers[label] ?? "—";
      return `<tr>
        <td style="padding:10px 16px;font-weight:600;color:#602C01;background:#faf7f4;border-bottom:1px solid #e8e2dc;white-space:nowrap">${label}</td>
        <td style="padding:10px 16px;color:#262626;border-bottom:1px solid #e8e2dc">${answer}</td>
      </tr>`;
    }).join("");
 
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <tr>
          <td style="background:#602C01;padding:28px 32px">
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,.7);letter-spacing:0.08em;text-transform:uppercase">New Client Inquiry</p>
            <h1 style="margin:6px 0 0;font-size:22px;color:#ffffff;font-weight:700">${name}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0">
            <h2 style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8a7060">Contact Info</h2>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#575757;width:72px">Email</td>
                <td style="padding:6px 0;font-size:14px;color:#262626;font-weight:500">
                  <a href="mailto:${email}" style="color:#602C01">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#575757">Phone</td>
                <td style="padding:6px 0;font-size:14px;color:#262626;font-weight:500">
                  <a href="tel:${phone}" style="color:#602C01">${phone}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="padding:20px 32px 0"><hr style="border:none;border-top:1px solid #e8e2dc;margin:0"></td></tr>
        <tr>
          <td style="padding:20px 32px 0">
            <h2 style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8a7060">Quiz Answers</h2>
            <table cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e8e2dc;border-radius:8px;overflow:hidden;border-collapse:collapse">
              ${answerRows}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px">
            <p style="margin:0;font-size:13px;color:#aaa;text-align:center">Sent via daniellamendozafit.com intake form</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
 
    await resend.emails.send({
      from: "Daniella Mendoza <intake@daniellamendozafit.com>",
      to: "daniellamendoza05@icloud.com",
      replyTo: email,
      subject: `New Client Inquiry from ${name}`,
      html,
    });
 
    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
 
  } catch (err) {
    console.error("submit-intake error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
 
