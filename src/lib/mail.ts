import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || process.env.SMTP_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || process.env.SMTP_PORT),
  secure: process.env.EMAIL_SERVER_PORT === '465' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER || process.env.SMTP_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD || process.env.SMTP_PASSWORD,
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
    from: `"${process.env.SMTP_FROM_NAME || 'Dr Muhammad Kamran'}" <${process.env.EMAIL_FROM || process.env.SMTP_FROM_EMAIL}>`,
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
