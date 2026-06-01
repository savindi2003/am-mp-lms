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


export async function sendWelcomeEmail(
  to: string,
  username: string,
  password: string,
) {
  const transporter = createTransport();

  await transporter.sendMail({
  from: `LMS Support <${process.env.EMAIL_FROM}>`,
  to,
  subject: "Your LMS account has been created",
  html: `
  <div style="
    margin:0;
    padding:0;
    background:#f5f7fb;
    font-family:Arial,Helvetica,sans-serif;
  ">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="
            background:#ffffff;
            border-radius:18px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);
          ">

            <!-- HEADER -->
            <tr>
              <td style="
                background:#0f172a;
                padding:32px 40px;
                text-align:center;
              ">
                <h1 style="
                  margin:0;
                  color:#ffffff;
                  font-size:30px;
                  font-weight:700;
                  letter-spacing:0.5px;
                ">
                  Welcome to LMS
                </h1>

                <p style="
                  margin-top:10px;
                  color:#cbd5e1;
                  font-size:15px;
                  line-height:24px;
                ">
                  Your learning journey starts here
                </p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:40px;">

                <p style="
                  margin:0 0 18px;
                  color:#0f172a;
                  font-size:16px;
                  line-height:28px;
                ">
                  Hello,
                </p>

                <p style="
                  margin:0 0 30px;
                  color:#475569;
                  font-size:15px;
                  line-height:28px;
                ">
                  Your LMS account has been successfully created. 
                  Use the credentials below to access your student portal.
                </p>

                <!-- LOGIN BOX -->
                <table width="100%" cellpadding="0" cellspacing="0" style="
                  border:1px solid #e2e8f0;
                  background:#f8fafc;
                  margin-bottom:30px;
                ">
                  <tr>
                    <td style="padding:28px;">

                      <p style="
                        margin:0 0 14px;
                        color:#64748b;
                        font-size:13px;
                        text-transform:uppercase;
                        letter-spacing:1px;
                        font-weight:700;
                      ">
                        Login Credentials
                      </p>

                      <div style="margin-bottom:18px;">
                        <p style="
                          margin:0 0 6px;
                          color:#94a3b8;
                          font-size:13px;
                        ">
                          Username (NIC)
                        </p>

                        <p style="
                          margin:0;
                          color:#0f172a;
                          font-size:18px;
                          font-weight:700;
                        ">
                          ${username}
                        </p>
                      </div>

                      <div>
                        <p style="
                          margin:0 0 6px;
                          color:#94a3b8;
                          font-size:13px;
                        ">
                          Password
                        </p>

                        <p style="
                          margin:0;
                          color:#0f172a;
                          font-size:18px;
                          font-weight:700;
                          letter-spacing:1px;
                        ">
                          ${password}
                        </p>
                      </div>

                    </td>
                  </tr>
                </table>

                
                <!-- NOTICE -->
                <div style="
                  background:#fff7ed;
                  border:1px solid #fed7aa;
                  padding:18px;
                ">
                  <p style="
                    margin:0;
                    color:#9a3412;
                    font-size:14px;
                    line-height:24px;
                  ">
                    For security purposes, please change your password after your first login.
                  </p>
                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="
                border-top:1px solid #e2e8f0;
                padding:24px 40px;
                text-align:center;
                background:#f8fafc;
              ">
                <p style="
                  margin:0;
                  color:#64748b;
                  font-size:13px;
                  line-height:22px;
                ">
                  LMS Student Management System
                </p>

                <p style="
                  margin:8px 0 0;
                  color:#94a3b8;
                  font-size:12px;
                ">
                  © ${new Date().getFullYear()} LMS. All rights reserved.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `,
  text: `
Welcome to LMS

Your account has been created successfully.

Username: ${username}
Password: ${password}

Login here:
${process.env.NEXT_PUBLIC_APP_URL}
  `,
});
}