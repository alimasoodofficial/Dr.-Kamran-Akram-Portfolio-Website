import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendMeetingInvitation({
  to,
  name,
  date,
  time,
  duration,
  platform,
  meetingLink,
}: {
  to: string;
  name: string;
  date: string;
  time: string;
  duration: number;
  platform: string;
  meetingLink: string;
}) {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM || 'Dr Muhammad Kamran'}" <${process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: `Meeting Invitation: Consultation with Dr. Muhammad Kamran`,
    html: `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f6f5; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                  <span style="font-size: 24px; font-weight: 800; color: #10b981; letter-spacing: -0.5px; display: block;">Dr. Kamran Akram</span>
                  <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; display: block; margin-top: 6px;">Knowledge Center & Publications</span>
                </td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td style="padding: 32px;">
                  <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 22px; font-weight: 800; text-align: center; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Booking Confirmed!</h2>
                  
                  <p style="margin: 0 0 20px 0; color: #334155; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
                  <p style="margin: 0 0 24px 0; color: #334155; font-size: 15px; line-height: 1.6;">Your <strong>${duration}-minute</strong> consultation has been successfully scheduled. Below are the details for your appointment:</p>
                  
                  <!-- Details Box -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-bottom: 8px; font-size: 14px; color: #047857; font-weight: 600; width: 90px; vertical-align: top;">Date:</td>
                            <td style="padding-bottom: 8px; font-size: 14px; color: #064e3b; font-weight: 700; vertical-align: top;">${date}</td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 8px; font-size: 14px; color: #047857; font-weight: 600; vertical-align: top;">Time:</td>
                            <td style="padding-bottom: 8px; font-size: 14px; color: #064e3b; font-weight: 700; vertical-align: top;">${time} (AEST/AEDT)</td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; color: #047857; font-weight: 600; vertical-align: top;">Platform:</td>
                            <td style="font-size: 14px; color: #064e3b; font-weight: 700; vertical-align: top;">${platform}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6; text-align: center;">
                    You can join the meeting using the button below at the scheduled time:
                  </p>

                  <!-- CTA Button -->
                  <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                    <tr>
                      <td align="center" bgcolor="#10b981" style="border-radius: 12px; box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);">
                        <a href="${meetingLink}" target="_blank" style="font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 12px; display: inline-block; background-color: #10b981; border: 1px solid #10b981;">
                          💻 Join Meeting
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6; text-align: center;">
                    If you need to reschedule or have any questions, please reply directly to this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 32px; background-color: #fafbfb; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                    © ${new Date().getFullYear()} Dr. Kamran Akram. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendEbookPurchaseConfirmation({
  to,
  ebookTitle,
  ebookCover,
  downloadUrl,
  flipbookUrl,
}: {
  to: string;
  ebookTitle: string;
  ebookCover?: string;
  downloadUrl: string;
  flipbookUrl: string;
}) {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM || 'Dr Muhammad Kamran'}" <${process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: `Your E-Book is Ready: ${ebookTitle}`,
    html: `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f6f5; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                  <span style="font-size: 24px; font-weight: 800; color: #10b981; letter-spacing: -0.5px; display: block;">Dr. Kamran Akram</span>
                  <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; display: block; margin-top: 6px;">Knowledge Center & Publications</span>
                </td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td style="padding: 32px;">
                  <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 22px; font-weight: 800; text-align: center; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Thank You for Your Purchase!</h2>
                  <p style="margin: 0 0 24px 0; color: #64748b; font-size: 15px; text-align: center; line-height: 1.5;">Your payment was successful. You now have lifetime access to this resource.</p>
                  
                  <!-- Book Details Box -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; margin-bottom: 24px;">
                    <tr>
                      ${ebookCover ? `
                      <td style="padding: 20px; width: 70px; vertical-align: middle;">
                        <img src="${ebookCover}" alt="${ebookTitle}" style="width: 70px; height: 95px; object-fit: cover; border-radius: 6px; box-shadow: 0 4px 10px rgba(6, 78, 59, 0.15); display: block;" />
                      </td>
                      ` : ''}
                      <td style="padding: 20px; ${ebookCover ? 'padding-left: 0;' : ''} vertical-align: middle; text-align: left;">
                        <span style="font-size: 10px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Purchased E-Book</span>
                        <h4 style="margin: 0; color: #064e3b; font-size: 16px; font-weight: 800; line-height: 1.4;">${ebookTitle}</h4>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #047857; font-weight: 500;">Format: Secure Interactive Flipbook</p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6; text-align: center;">
                    To read your eBook, click the button below. If prompted in the reader, simply enter your purchase email address (<strong style="color: #0f172a;">${to}</strong>) to verify your access.
                  </p>

                  <!-- CTA Button -->
                  <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                    <tr>
                      <td align="center" bgcolor="#10b981" style="border-radius: 12px; box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);">
                        <a href="${flipbookUrl}" target="_blank" style="font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 12px; display: inline-block; background-color: #10b981; border: 1px solid #10b981;">
                          📖 Open Interactive Flipbook
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.4;">
                    Read directly in your browser with secure page-turning controls. No downloads required.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 32px; background-color: #fafbfb; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                    If you have any questions or experience access issues, please reach out to <a href="mailto:${process.env.ADMIN_EMAIL || 'alimasood.work@gmail.com'}" style="color: #10b981; text-decoration: none; font-weight: 600;">support</a>.
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                    © ${new Date().getFullYear()} Dr. Kamran Akram. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Purchase confirmation email successfully sent to:", to, "Result:", result);
    return { success: true };
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendEbookAdminNotification({
  customerName,
  customerEmail,
  ebookTitle,
  pricePaid,
  promocodeUsed,
}: {
  customerName: string;
  customerEmail: string;
  ebookTitle: string;
  pricePaid: number;
  promocodeUsed?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'alimasood.work@gmail.com';
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM || 'Dr Muhammad Kamran'}" <${process.env.EMAIL_SERVER_USER}>`,
    to: adminEmail,
    subject: `🚨 E-Book Sold: ${ebookTitle}`,
    html: `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f6f5; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                  <span style="font-size: 24px; font-weight: 800; color: #3b82f6; letter-spacing: -0.5px; display: block;">Sales Notification</span>
                  <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; display: block; margin-top: 6px;">Dr. Kamran Akram Store</span>
                </td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td style="padding: 32px;">
                  <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 22px; font-weight: 800; text-align: center; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">🎉 E-Book Successfully Sold!</h2>
                  
                  <!-- Details Box 1: Order Summary -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Order Summary</h4>
                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-bottom: 6px; font-size: 14px; color: #64748b; width: 120px; vertical-align: top;">E-Book Title:</td>
                            <td style="padding-bottom: 6px; font-size: 14px; color: #0f172a; font-weight: 600; vertical-align: top;">${ebookTitle}</td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 6px; font-size: 14px; color: #64748b; vertical-align: top;">Price Paid:</td>
                            <td style="padding-bottom: 6px; font-size: 14px; color: #10b981; font-weight: 800; vertical-align: top;">$${pricePaid.toFixed(2)} USD</td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; color: #64748b; vertical-align: top;">Promo Code:</td>
                            <td style="font-size: 14px; color: #0f172a; vertical-align: top;">
                              ${promocodeUsed ? `<span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; display: inline-block;">${promocodeUsed}</span>` : '<span style="color: #94a3b8;">None</span>'}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Details Box 2: Customer Details -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Customer Details</h4>
                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-bottom: 6px; font-size: 14px; color: #64748b; width: 120px; vertical-align: top;">Name:</td>
                            <td style="padding-bottom: 6px; font-size: 14px; color: #0f172a; font-weight: 600; vertical-align: top;">${customerName}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; color: #64748b; vertical-align: top;">Email:</td>
                            <td style="font-size: 14px; color: #0f172a; vertical-align: top;"><a href="mailto:${customerEmail}" style="color: #3b82f6; text-decoration: none; font-weight: 600;">${customerEmail}</a></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 30px 0 0 0; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.4;">
                    This is an automated notification from your digital storefront.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 32px; background-color: #fafbfb; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                    © ${new Date().getFullYear()} Dr. Kamran Akram. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending admin sales notification email:', error);
    return { success: false, error };
  }
}

export async function sendEbookLibraryVerificationCode({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM || 'Dr Muhammad Kamran'}" <${process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: `${code} is your eBook Library verification code`,
    html: `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f6f5; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                  <span style="font-size: 24px; font-weight: 800; color: #10b981; letter-spacing: -0.5px; display: block;">Dr. Kamran Akram</span>
                  <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; display: block; margin-top: 6px;">Knowledge Center & Publications</span>
                </td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td style="padding: 32px; text-align: center;">
                  <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 22px; font-weight: 800; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Verify Your Email Address</h2>
                  <p style="margin: 0 0 24px 0; color: #64748b; font-size: 15px; line-height: 1.5;">You requested to access your eBook Library. Use the verification code below to sign in. This code is valid for 5 minutes.</p>
                  
                  <!-- Code Box -->
                  <div style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; padding: 20px; margin: 24px auto; max-width: 280px;">
                    <span style="font-size: 10px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">Verification Code</span>
                    <span style="font-size: 36px; font-weight: 800; color: #064e3b; letter-spacing: 4px; font-family: Courier, monospace; display: block;">${code}</span>
                  </div>

                  <p style="margin: 0 0 24px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                    If you did not request this code, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 32px; background-color: #fafbfb; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                    © ${new Date().getFullYear()} Dr. Kamran Akram. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Library verification email successfully sent to:", to, "Result:", result);
    return { success: true };
  } catch (error) {
    console.error('Error sending library verification email:', error);
    return { success: false, error };
  }
}



