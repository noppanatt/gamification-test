import * as nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const DEFAULT_SENDER_NAME = process.env.DEFAULT_SENDER_NAME;
const SMTP_EMAIL = process.env.SMTP_EMAIL;

export type TEmailData = {
  to: string[];
  subject: string;
  html: string;
  sender: {
    name: string;
    email: string;
  };
  cc?: string[];
};

export type TEmailRes = {
  success: boolean;
  message: string;
  messageId?: string;
  actualSender?: string;
  error?: any;
};

export const sendEmail = async (emailData: TEmailData): Promise<TEmailRes> => {
  try {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return {
        success: false,
        message: "SMTP env vars are missing",
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: SMTP_PORT ? Number(SMTP_PORT) : 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    //TODO REMOVE MOCK
    // const emailData = {
    //   to: ["noppanat.b@codemonday.com"],
    //   subject: "Reward Redemption Notification",
    //   html: htmlFormat,
    //   sender: {
    //     name: "Retail Web Stockmovement",
    //     email: "smtp_stockmovement@betagro.com",
    //   },
    // };

    // 2. กำหนด sender (แสดงชื่อที่ต้องการ แต่ใช้ email ที่ authenticate)
    const displayName = emailData.sender?.name || DEFAULT_SENDER_NAME;
    const authenticatedEmail = SMTP_USER!; // email ที่ authenticate แล้ว
    const replyToEmail = emailData.sender?.email || authenticatedEmail;

    const mailOptions: MailOptions = {
      subject: emailData.subject,
      from: `"${displayName}" <${authenticatedEmail}>`,
      replyTo: replyToEmail,
      to: Array.isArray(emailData.to) ? emailData.to.join(", ") : emailData.to,
      html: emailData.html,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", {
      messageId: result.messageId,
      displayName,
      actualFrom: authenticatedEmail,
      replyTo: replyToEmail,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    return {
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
      actualSender: `"${displayName}" <${authenticatedEmail}>`,
    };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return {
      success: false,
      message: "An error occurred while sending the email.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
