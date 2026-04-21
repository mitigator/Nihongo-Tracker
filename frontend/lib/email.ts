import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOtpEmail(email: string, otp: string, name: string) {
  await resend.emails.send({
    from: "Nihongo Tracker <noreply@shubhammishra.in>",
    to: email,
    subject: "Your Nihongo Tracker verification code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your email</title>
        </head>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 16px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom:32px;">
                      <div style="display:inline-block;background:#facc15;border-radius:16px;width:56px;height:56px;line-height:56px;text-align:center;font-size:24px;">日</div>
                      <div style="color:#facc15;font-size:11px;font-weight:900;letter-spacing:4px;text-transform:uppercase;margin-top:12px;">Nihongo Tracker</div>
                    </td>
                  </tr>

                  <!-- Card -->
                  <tr>
                    <td style="background:#111111;border:1px solid #222222;border-radius:20px;padding:40px;">
                      <p style="color:#888888;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Welcome</p>
                      <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0 0 8px;">Hey ${name} 👋</h1>
                      <p style="color:#666666;font-size:14px;margin:0 0 32px;line-height:1.6;">
                        Use the code below to verify your email and start your Japanese learning journey.
                        This code expires in <strong style="color:#aaaaaa;">10 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="background:#0a0a0a;border:1px solid #333333;border-radius:14px;padding:28px;text-align:center;margin-bottom:32px;">
                        <div style="color:#888888;font-size:10px;font-weight:900;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px;">Verification Code</div>
                        <div style="color:#facc15;font-size:42px;font-weight:900;letter-spacing:12px;">${otp}</div>
                      </div>

                      <p style="color:#444444;font-size:12px;margin:0;line-height:1.6;">
                        If you didn't request this, you can safely ignore this email. Someone may have entered your email address by mistake.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top:24px;">
                      <p style="color:#333333;font-size:11px;margin:0;">© ${new Date().getFullYear()} Nihongo Tracker · All rights reserved</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}