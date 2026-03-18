import nodemailer from "nodemailer";

export async function sendNewsletterEmails(
  emails: string[],
  newsletter: {
    id: string;
    title: string;
    subtitle?: string;
    hero_image_url?: string;
    content: string;
  },
  baseUrl: string
) {
  if (!emails || emails.length === 0) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const from = `"${process.env.SMTP_FROM_NAME || "Dr Muhammad Kamran"}" <${
    process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
  }>`;

  // Create a quick overview from content (strip markdown/HTML roughly, max 200 chars)
  const plainTextPreview =
    newsletter.content
      .replace(/<[^>]+>/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .substring(0, 200)
      .trim() + "...";

  const readMoreLink = `${baseUrl}/newsletter/${newsletter.id}`;

  const heroImageHtml = newsletter.hero_image_url
    ? `<div style="text-align: center; margin-bottom: 20px;">
         <img src="${newsletter.hero_image_url}" alt="Hero Image" style="max-width: 100%; height: auto; border-radius: 8px;" />
       </div>`
    : "";

  const subtitleHtml = newsletter.subtitle
    ? `<p style="font-size: 16px; color: #555; margin-bottom: 15px;"><em>${newsletter.subtitle}</em></p>`
    : "";

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      ${heroImageHtml}
      <h1 style="color: #111; font-size: 24px;">${newsletter.title}</h1>
      ${subtitleHtml}
      <p style="font-size: 16px; color: #444;">${plainTextPreview}</p>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="${readMoreLink}" style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Read More
        </a>
      </div>
      
      <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #999; text-align: center;">
        You're receiving this email because you subscribed to updates.
      </p>
    </div>
  `;

  // For real production we might want to batch standard Bcc emails
  // Nodemailer BCC can take an array, sending one email with the recipients hidden
  try {
    await transporter.sendMail({
      from,
      bcc: emails, // Use BCC to hide other subscribers' emails
      subject: newsletter.title,
      html: htmlTemplate,
      text: `${newsletter.title}\n\n${
        newsletter.subtitle || ""
      }\n\n${plainTextPreview}\n\nRead more at: ${readMoreLink}`,
    });
    console.log(`Newsletter emails sent to ${emails.length} subscribers.`);
  } catch (error) {
    console.error("Error sending newsletter emails:", error);
  }
}
