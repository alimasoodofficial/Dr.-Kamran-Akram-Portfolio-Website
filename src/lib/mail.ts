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
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">Booking Confirmed!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your <strong>${duration}-minute</strong> consultation has been successfully scheduled.</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 0;"><strong>Time:</strong> ${time} (AEST/AEDT)</p>
          <p style="margin: 0;"><strong>Platform:</strong> ${platform}</p>
        </div>

        <p>You can join the meeting using the link below:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${meetingLink}" style="background: #ef4444; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Meeting</a>
        </p>

        <p>If you need to reschedule or have any questions, please reply to this email.</p>
        
        <p style="margin-top: 40px; font-size: 0.8em; color: #64748b;">
          Regards,<br>
          <strong>Dr. Muhammad Kamran Team</strong>
        </p>
      </div>
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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 32px; border-radius: 20px; background: #ffffff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
        
        {/* Header Header Brand */}
        <div style="text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 28px;">
          <span style="font-size: 24px; font-weight: 800; color: #10b981; letter-spacing: -0.5px;">Dr. Kamran Akram</span>
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; tracking: 1px; margin-top: 4px;">Knowledge Center & Publications</div>
        </div>

        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; text-align: center;">Thank You for Your Purchase!</h2>
        <p style="text-align: center; color: #64748b; font-size: 14px; margin-top: 4px; margin-bottom: 24px;">Your payment was successful. You now have lifetime access to this resource.</p>
        
        <!-- Book Details Box -->
        <div style="background: #f8fafc; border: 1px solid #f1f5f9; padding: 20px; border-radius: 16px; margin: 24px 0; display: flex; align-items: center; gap: 16px;">
          ${ebookCover ? `<img src="${ebookCover}" alt="${ebookTitle}" style="width: 70px; height: 95px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" />` : ''}
          <div style="flex: 1;">
            <span style="font-size: 10px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Purchased E-Book</span>
            <h4 style="margin: 4px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 800; line-height: 1.3;">${ebookTitle}</h4>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Format: Secure PDF & Interactive Flipbook</p>
          </div>
        </div>

        <p style="font-size: 14px; color: #475569;">You can read this publication in two different ways. Choose your preferred format below:</p>

        <!-- CTA Options -->
        <div style="margin: 32px 0; text-align: center; display: block;">
          
          <!-- Option 1: 3D Flipbook -->
          <div style="margin-bottom: 20px;">
            <a href="${flipbookUrl}" style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2); width: 80%;">
              📖 Open Interactive 3D Flipbook
            </a>
            <p style="font-size: 11px; color: #94a3b8; margin-top: 6px; margin-bottom: 0;">Read directly in your browser with dynamic page-turning animations.</p>
          </div>

          <!-- Option 2: Download PDF -->
          <div>
            <a href="${downloadUrl}" style="display: inline-block; background: #0f172a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; width: 80%;">
              📥 Download PDF File
            </a>
            <p style="font-size: 11px; color: #94a3b8; margin-top: 6px; margin-bottom: 0;">Save the PDF document directly to your computer or mobile device.</p>
          </div>

        </div>

        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
          If you have any questions or experience download issues, please reach out to <a href="mailto:${process.env.ADMIN_EMAIL || 'alimasood.work@gmail.com'}" style="color: #10b981; text-decoration: none;">support</a>.<br><br>
          © ${new Date().getFullYear()} Dr. Kamran Akram. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    return { success: false, error };
  }
}

