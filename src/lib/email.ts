import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://imkamran.com';

export interface BookingEmailData {
  userName: string;
  userEmail: string;
  country: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface RescheduleEmailData {
  userName: string;
  userEmail: string;
  country: string;
  oldStartTime: string;
  oldEndTime: string;
  newStartTime: string;
  newEndTime: string;
}

export async function sendUserConfirmation(data: BookingEmailData) {
  const { userName, userEmail, country, startTime, endTime, notes } = data;

  const htmlContent = `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f6f5; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                <span style="font-size: 24px; font-weight: 800; color: #10b981; letter-spacing: -0.5px; display: block;">Dr. Muhammad Kamran</span>
                <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; display: block; margin-top: 6px;">Knowledge Center & Publications</span>
              </td>
            </tr>
            
            <!-- Content Body -->
            <tr>
              <td style="padding: 32px;">
                <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 22px; font-weight: 800; text-align: center; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">✅ Booking Confirmed!</h2>
                
                <p style="margin: 0 0 20px 0; color: #334155; font-size: 15px; line-height: 1.6;">Dear <strong>${userName}</strong>,</p>
                <p style="margin: 0 0 24px 0; color: #334155; font-size: 15px; line-height: 1.6;">Thank you for booking an appointment with Dr. Muhammad Kamran. Your booking has been confirmed! Here are the details:</p>
                
                <!-- Details Box -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="margin: 0 0 12px 0; color: #064e3b; font-size: 16px; font-weight: 800;">📅 Appointment Details</h3>
                      <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #047857; font-weight: 600; width: 110px; vertical-align: top;">Date & Time:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #064e3b; font-weight: 700; vertical-align: top;">
                            ${new Date(startTime).toLocaleString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  })} (AEST)
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #047857; font-weight: 600; vertical-align: top;">Duration:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #064e3b; font-weight: 700; vertical-align: top;">
                            ${Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)} minutes
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: ${notes ? '8px' : '0px'}; font-size: 14px; color: #047857; font-weight: 600; vertical-align: top;">Country:</td>
                          <td style="padding-bottom: ${notes ? '8px' : '0px'}; font-size: 14px; color: #064e3b; font-weight: 700; vertical-align: top;">${country}</td>
                        </tr>
                        ${notes ? `
                        <tr>
                          <td style="font-size: 14px; color: #047857; font-weight: 600; vertical-align: top;">Your Notes:</td>
                          <td style="font-size: 14px; color: #064e3b; font-weight: 500; font-style: italic; vertical-align: top;">"${notes}"</td>
                        </tr>
                        ` : ''}
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Timezone Alert Box -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 12px 16px; font-size: 13px; color: #1e40af; line-height: 1.5;">
                      ⏰ <strong>Important:</strong> All appointment times are in Australian Eastern Time (AEST/AEDT). Please convert to your local timezone accordingly.
                    </td>
                  </tr>
                </table>

                <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 800;">📋 What's Next?</h3>
                <ul style="margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.6;">
                  <li style="margin-bottom: 6px;">You will receive a meeting link and details separately before your appointment</li>
                  <li style="margin-bottom: 6px;">Please arrive 5 minutes early to test your setup</li>
                  <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                </ul>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 32px; background-color: #fafbfb; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  This is an automated confirmation email.
                </p>
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL_SERVER_USER}" style="color: #10b981; text-decoration: none; font-weight: 600;">${process.env.EMAIL_SERVER_USER}</a>.
                </p>
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  <a href="${baseUrl}/privacy" style="color: #10b981; text-decoration: none; font-weight: 600; margin: 0 8px;">Privacy Policy</a>
                  <span style="color: #cbd5e1;">|</span>
                  <a href="${baseUrl}/terms" style="color: #10b981; text-decoration: none; font-weight: 600; margin: 0 8px;">Terms & Conditions</a>
                </p>
                <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                  © ${new Date().getFullYear()} Dr. Muhammad Kamran. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM || 'Dr Muhammad Kamran'}" <${process.env.EMAIL_SERVER_USER}>`,
    to: userEmail,
    subject: '✅ Booking Confirmation - Dr. Muhammad Kamran',
    html: htmlContent,
    text: `Hi ${userName},\n\nYour booking with Dr. Muhammad Kamran has been successfully confirmed.\n\nStart Time: ${startTime}\nEnd Time: ${endTime}\nNotes: ${notes || 'None'}\n\nThank you!`,
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * Send notification email to admin
 */
export async function sendAdminNotification(data: BookingEmailData) {
  const { userName, userEmail, country, startTime, endTime, notes } = data;

  const htmlContent = `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f6f5; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                <span style="font-size: 24px; font-weight: 800; color: #f59e0b; letter-spacing: -0.5px; display: block;">Booking Alert</span>
                <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; display: block; margin-top: 6px;">Dr. Muhammad Kamran Admin</span>
              </td>
            </tr>
            
            <!-- Content Body -->
            <tr>
              <td style="padding: 32px;">
                <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 22px; font-weight: 800; text-align: center;">🔔 New Booking Alert!</h2>
                
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 12px 16px; font-size: 13px; color: #b45309; line-height: 1.5; font-weight: 600;">
                      ⚡ Action Required: A new client has booked an appointment with you.
                    </td>
                  </tr>
                </table>

                <!-- Details Box -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #fcfcfc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="margin: 0 0 12px 0; color: #f59e0b; font-size: 16px; font-weight: 800;">👤 Client Information</h3>
                      <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #64748b; width: 120px; vertical-align: top;">Name:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #0f172a; font-weight: 700; vertical-align: top;">${userName}</td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #64748b; vertical-align: top;">Email:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #0f172a; font-weight: 600; vertical-align: top;">
                            <a href="mailto:${userEmail}" style="color: #3b82f6; text-decoration: none;">${userEmail}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #64748b; vertical-align: top;">Country:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #0f172a; vertical-align: top;">${country}</td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #64748b; vertical-align: top;">Date & Time:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #0f172a; font-weight: 700; vertical-align: top;">
                            ${new Date(startTime).toLocaleString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  })} (AEST)
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: ${notes ? '8px' : '0px'}; font-size: 14px; color: #64748b; vertical-align: top;">Duration:</td>
                          <td style="padding-bottom: ${notes ? '8px' : '0px'}; font-size: 14px; color: #0f172a; vertical-align: top;">
                            ${Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)} minutes
                          </td>
                        </tr>
                        ${notes ? `
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #64748b; vertical-align: top;">Client Notes:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #0f172a; font-style: italic; vertical-align: top;">"${notes}"</td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="font-size: 14px; color: #64748b; vertical-align: top;">Booked At:</td>
                          <td style="font-size: 14px; color: #64748b; vertical-align: top;">
                            ${new Date().toLocaleString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  })} (AEST)
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 800;">📋 Next Steps:</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.6;">
                  <li style="margin-bottom: 6px;">Review the client's details and notes</li>
                  <li style="margin-bottom: 6px;">Prepare any necessary materials for the appointment</li>
                  <li>The client has received an automatic confirmation email</li>
                </ul>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 32px; background-color: #fafbfb; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                  This is an automated notification from your booking system.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const mailOptions = {
    from: `"Booking System" <${process.env.EMAIL_SERVER_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🔔 New Booking: ${userName} (${country}) - ${new Date(startTime).toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' })}`,
    html: htmlContent,
    text: `New Booking Notification:\n\nClient Name: ${userName}\nEmail: ${userEmail}\nCountry: ${country}\nStart Time: ${startTime}\nEnd Time: ${endTime}\nNotes: ${notes || 'None'}`,
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * Send reschedule notification email to the user
 */
export async function sendUserRescheduleNotification(data: RescheduleEmailData) {
  const { userName, userEmail, oldStartTime, oldEndTime, newStartTime, newEndTime } = data;

  const htmlContent = `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f6f5; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                <span style="font-size: 24px; font-weight: 800; color: #10b981; letter-spacing: -0.5px; display: block;">Dr. Muhammad Kamran</span>
                <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; display: block; margin-top: 6px;">Knowledge Center & Publications</span>
              </td>
            </tr>
            
            <!-- Content Body -->
            <tr>
              <td style="padding: 32px;">
                <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 22px; font-weight: 800; text-align: center; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">📅 Appointment Rescheduled</h2>
                
                <p style="margin: 0 0 20px 0; color: #334155; font-size: 15px; line-height: 1.6;">Dear <strong>${userName}</strong>,</p>
                <p style="margin: 0 0 24px 0; color: #334155; font-size: 15px; line-height: 1.6;">Your appointment with Dr. Muhammad Kamran has been rescheduled. Please see the updated details below:</p>
                
                <!-- Details Box -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="margin: 0 0 16px 0; color: #064e3b; font-size: 16px; font-weight: 800;">🔄 Schedule Change</h3>
                      <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 12px; font-size: 14px; color: #047857; font-weight: 600; width: 120px; vertical-align: top;">Previous Time:</td>
                          <td style="padding-bottom: 12px; font-size: 14px; color: #ef4444; text-decoration: line-through; vertical-align: top;">
                            ${new Date(oldStartTime).toLocaleString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  })} (AEST)
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 12px; font-size: 14px; color: #047857; font-weight: 600; vertical-align: top;">New Time:</td>
                          <td style="padding-bottom: 12px; font-size: 15px; color: #10b981; font-weight: 700; vertical-align: top;">
                            ✅ ${new Date(newStartTime).toLocaleString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  })} (AEST)
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #047857; font-weight: 600; vertical-align: top;">Duration:</td>
                          <td style="font-size: 14px; color: #064e3b; font-weight: 700; vertical-align: top;">
                            ${Math.round((new Date(newEndTime).getTime() - new Date(newStartTime).getTime()) / 60000)} minutes
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Timezone Alert Box -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 12px 16px; font-size: 13px; color: #1e40af; line-height: 1.5;">
                      ⏰ <strong>Important:</strong> All appointment times are in Australian Eastern Time (AEST/AEDT). Please convert to your local timezone accordingly.
                    </td>
                  </tr>
                </table>

                <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6; text-align: center;">
                  If you have any questions or concerns about the new time, please don't hesitate to contact us.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 32px; background-color: #fafbfb; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  This is an automated notification.
                </p>
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL_SERVER_USER}" style="color: #10b981; text-decoration: none; font-weight: 600;">${process.env.EMAIL_SERVER_USER}</a>.
                </p>
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  <a href="${baseUrl}/privacy" style="color: #10b981; text-decoration: none; font-weight: 600; margin: 0 8px;">Privacy Policy</a>
                  <span style="color: #cbd5e1;">|</span>
                  <a href="${baseUrl}/terms" style="color: #10b981; text-decoration: none; font-weight: 600; margin: 0 8px;">Terms & Conditions</a>
                </p>
                <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                  © ${new Date().getFullYear()} Dr. Muhammad Kamran. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM || 'Dr Muhammad Kamran'}" <${process.env.EMAIL_SERVER_USER}>`,
    to: userEmail,
    subject: '📅 Appointment Rescheduled - Dr. Muhammad Kamran',
    html: htmlContent,
    text: `Hi ${userName},\n\nYour appointment with Dr. Muhammad Kamran has been rescheduled.\n\nOld Start Time: ${oldStartTime}\nOld End Time: ${oldEndTime}\nNew Start Time: ${newStartTime}\nNew End Time: ${newEndTime}\n\nThank you!`,
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * Send reschedule notification email to admin
 */
export async function sendAdminRescheduleNotification(data: RescheduleEmailData) {
  const { userName, userEmail, country, oldStartTime, newStartTime, newEndTime } = data;

  const htmlContent = `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f6f5; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
                <span style="font-size: 24px; font-weight: 800; color: #8b5cf6; letter-spacing: -0.5px; display: block;">Booking Rescheduled</span>
                <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; display: block; margin-top: 6px;">Dr. Muhammad Kamran Admin</span>
              </td>
            </tr>
            
            <!-- Content Body -->
            <tr>
              <td style="padding: 32px;">
                <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 22px; font-weight: 800; text-align: center;">📅 Booking Rescheduled</h2>
                
                <p style="margin: 0 0 24px 0; color: #334155; font-size: 15px; line-height: 1.6; text-align: center;">A booking has been moved to a new time. Details below:</p>

                <!-- Details Box -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #fcfcfc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="margin: 0 0 12px 0; color: #8b5cf6; font-size: 16px; font-weight: 800;">📋 Reschedule Details</h3>
                      <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #64748b; width: 130px; vertical-align: top;">Client:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #0f172a; font-weight: 700; vertical-align: top;">${userName} (${country})</td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #64748b; vertical-align: top;">Email:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #0f172a; font-weight: 600; vertical-align: top;">
                            <a href="mailto:${userEmail}" style="color: #3b82f6; text-decoration: none;">${userEmail}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #64748b; vertical-align: top;">Previous Time:</td>
                          <td style="padding-bottom: 8px; font-size: 14px; color: #ef4444; text-decoration: line-through; vertical-align: top;">
                            ${new Date(oldStartTime).toLocaleString('en-AU', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  })}
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #64748b; vertical-align: top;">New Time:</td>
                          <td style="font-size: 14px; color: #10b981; font-weight: bold; vertical-align: top;">
                            ${new Date(newStartTime).toLocaleString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  })} (AEST)
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0; font-size: 13px; color: #64748b; text-align: center;">
                  The client has been notified about this change via email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 32px; background-color: #fafbfb; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                  This is an automated notification from your booking system.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const mailOptions = {
    from: `"Booking System" <${process.env.EMAIL_SERVER_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📅 Rescheduled: ${userName} - ${new Date(newStartTime).toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' })}`,
    html: htmlContent,
    text: `Admin Reschedule Alert:\n\nClient Name: ${userName}\nEmail: ${userEmail}\nOld Start Time: ${oldStartTime}\nNew Start Time: ${newStartTime}\nNew End Time: ${newEndTime}`,
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * Test email configuration
 */
export async function testEmailConnection() {
  try {
    await transporter.verify();
    return { success: true, message: 'SMTP connection verified' };
  } catch (error) {
    return { success: false, message: 'SMTP connection failed', error };
  }
}
