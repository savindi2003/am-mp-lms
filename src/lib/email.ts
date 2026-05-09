import nodemailer from "nodemailer";

export function createTransport() {
  return nodemailer.createTransport({
    host: process.env.BREVO_HOST, // e.g. "smtp-relay.brevo.com"
    port: Number(process.env.BREVO_PORT), // e.g. 587
    secure: false,
    auth: {
      user: process.env.BREVO_LOGIN, // Brevo login (usually your email)
      pass: process.env.BREVO_SMTPKEY, // Brevo SMTP key
    },
  });
}

export async function sendPasswordResetEmail(to: string, url: string) {
  const transporter = createTransport();
  await transporter.sendMail({
    from: `LMS Support <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Reset your password (valid for 10 minutes)",
    html: `
      <div style="font-family:system-ui,Segoe UI,Arial;">
        <h2>Reset your password</h2>
        <p>Click the link below to set a new password. This link expires in 10 minutes.</p>
        <p><a href="${url}" target="_blank" rel="noreferrer" style="color:#0f172a;">Reset password</a></p>
        <p>If you didn’t request this, you can ignore this email.</p>
      </div>
    `,
    text: `Reset your password: ${url}`,
  });
}
