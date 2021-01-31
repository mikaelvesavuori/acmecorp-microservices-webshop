import nodemailer from 'nodemailer';

/**
 * @description Helper for creating Nodemailer transport
 */
export const createTransport = (nodemailerUser: string, nodemailerPass: string) =>
  nodemailer.createTransport({
    host: `smtp.ethereal.email`,
    port: 587,
    secure: false,
    auth: {
      user: nodemailerUser,
      pass: nodemailerPass
    }
  });

/**
 * @description Helper for creating Nodemailer message object
 */
export const createNodemailerData = (
  recipientName: string,
  recipientEmail: string,
  subject: string,
  text: string,
  html: string
) => {
  const senderName = 'ACME Corp. Potted Plants';
  const senderEmail = 'orders@acmecorp.xyz';

  return {
    from: `${senderName} <${senderEmail}>`,
    to: `${recipientName} <${recipientEmail}>`,
    subject,
    text,
    html
  };
};
