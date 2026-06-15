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
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: process.env.EMAIL_SERVER_PORT === "465",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const from = `"${process.env.EMAIL_FROM || "Dr Muhammad Kamran"}" <${process.env.EMAIL_SERVER_USER
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
                ${newsletter.hero_image_url ? `
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src="${newsletter.hero_image_url}" alt="Hero Image" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 0 auto;" />
                </div>
                ` : ''}

                <h1 style="margin: 0 0 8px 0; color: #0f172a; font-size: 22px; font-weight: 800; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${newsletter.title}</h1>
                
                ${newsletter.subtitle ? `
                <p style="margin: 0 0 20px 0; font-size: 16px; color: #64748b; font-style: italic; line-height: 1.5;">${newsletter.subtitle}</p>
                ` : ''}

                <p style="margin: 0 0 24px 0; color: #334155; font-size: 15px; line-height: 1.6;">${plainTextPreview}</p>
                
                <!-- CTA Button -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                  <tr>
                    <td align="center" bgcolor="#10b981" style="border-radius: 12px; box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);">
                      <a href="${readMoreLink}" target="_blank" style="font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 12px; display: inline-block; background-color: #10b981; border: 1px solid #10b981;">
                        📖 Read Full Article
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 32px; background-color: #fafbfb; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  You are receiving this email because you subscribed to updates from Dr. Muhammad Kamran.
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

  // For real production we might want to batch standard Bcc emails
  // Nodemailer BCC can take an array, sending one email with the recipients hidden
  try {
    await transporter.sendMail({
      from,
      bcc: emails, // Use BCC to hide other subscribers' emails
      subject: newsletter.title,
      html: htmlTemplate,
      text: `${newsletter.title}\n\n${newsletter.subtitle || ""
        }\n\n${plainTextPreview}\n\nRead more at: ${readMoreLink}`,
    });
    console.log(`Newsletter emails sent to ${emails.length} subscribers.`);
  } catch (error) {
    console.error("Error sending newsletter emails:", error);
  }
}
