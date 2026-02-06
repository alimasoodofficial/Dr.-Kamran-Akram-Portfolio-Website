import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface BookingEmailData {
  userName: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  timezone: string;
  notes?: string;
}

/**
 * Send confirmation email to the user
 */
export async function sendUserConfirmation(data: BookingEmailData) {
  const { userName, userEmail, startTime, endTime, timezone, notes } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .booking-details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .detail-row {
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-label {
          font-weight: 600;
          color: #667eea;
          display: inline-block;
          width: 120px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">✅ Booking Confirmed!</h1>
        <p style="margin: 10px 0 0 0;">Your appointment has been successfully scheduled</p>
      </div>
      <div class="content">
        <p>Dear <strong>${userName}</strong>,</p>
        <p>Thank you for booking an appointment with Dr. Kamran Akram. Your booking has been confirmed!</p>
        
        <div class="booking-details">
          <h3 style="margin-top: 0; color: #667eea;">📅 Appointment Details</h3>
          <div class="detail-row">
            <span class="detail-label">Date & Time:</span>
            <span>${new Date(startTime).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })} (${timezone.replace(/_/g, ' ')})</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration:</span>
            <span>${Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)} minutes</span>
          </div>
          ${notes ? `
          <div class="detail-row">
            <span class="detail-label">Your Notes:</span>
            <span>${notes}</span>
          </div>
          ` : ''}
        </div>

        <p><strong>What's Next?</strong></p>
        <ul>
          <li>You will receive a reminder email 24 hours before your appointment</li>
          <li>Please arrive 5 minutes early</li>
          <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
        </ul>

        <div class="footer">
          <p>This is an automated confirmation email. Please do not reply to this email.</p>
          <p>If you have any questions, please contact us at ${process.env.SMTP_FROM_EMAIL}</p>
          <p style="margin-top: 20px;">© ${new Date().getFullYear()} Dr. Kamran Akram. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: userEmail,
    subject: '✅ Booking Confirmation - Dr. Kamran Akram',
    html: htmlContent,
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * Send notification email to admin
 */
export async function sendAdminNotification(data: BookingEmailData) {
  const { userName, userEmail, startTime, endTime, timezone, notes } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .lead-details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #f59e0b;
        }
        .detail-row {
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-label {
          font-weight: 600;
          color: #f59e0b;
          display: inline-block;
          width: 120px;
        }
        .alert {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">🔔 New Booking Alert!</h1>
        <p style="margin: 10px 0 0 0;">You have a new appointment booking</p>
      </div>
      <div class="content">
        <div class="alert">
          <strong>⚡ Action Required:</strong> A new client has booked an appointment with you.
        </div>
        
        <div class="lead-details">
          <h3 style="margin-top: 0; color: #f59e0b;">👤 Client Information</h3>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span><strong>${userName}</strong></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span><a href="mailto:${userEmail}">${userEmail}</a></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date & Time:</span>
            <span>${new Date(startTime).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })} (${timezone.replace(/_/g, ' ')})</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration:</span>
            <span>${Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)} minutes</span>
          </div>
          ${notes ? `
          <div class="detail-row">
            <span class="detail-label">Client Notes:</span>
            <span style="font-style: italic;">"${notes}"</span>
          </div>
          ` : ''}
          <div class="detail-row">
            <span class="detail-label">Booked At:</span>
            <span>${new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</span>
          </div>
        </div>

        <p><strong>📋 Next Steps:</strong></p>
        <ul>
          <li>Review the client's notes (if any)</li>
          <li>Prepare any necessary materials for the appointment</li>
          <li>The client has received an automatic confirmation email</li>
        </ul>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          This is an automated notification from your booking system.
        </p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Booking System" <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🔔 New Booking: ${userName} - ${new Date(startTime).toLocaleDateString()}`,
    html: htmlContent,
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
