import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, ...fields } = body;

    const subject =
      type === "verify"
        ? `New Verification Application — ${fields.name ?? "Unknown"}`
        : `New Reviewer Application — ${fields.name ?? "Unknown"}`;

    const rows = Object.entries(fields)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;text-transform:capitalize;">${k}</td><td style="padding:6px 12px;">${v}</td></tr>`)
      .join("");

    const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1614;">
        <h2 style="color:#eb4511;margin-bottom:24px;">${subject}</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e0d8cc;">
          ${rows}
        </table>
        <p style="margin-top:24px;font-size:12px;color:#999;">Sent from orcred.com contact form</p>
      </div>
    `;

    await resend.emails.send({
      from: "Orcred <noreply@orcred.com>",
      to:   "contact@orcred.com",
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ ok: false, error: "Failed to send" }, { status: 500 });
  }
}
