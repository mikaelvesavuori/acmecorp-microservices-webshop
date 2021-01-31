import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import nodemailer from 'nodemailer';

import { createTransport } from './frameworks/nodemailer';
import { createMessage } from './frameworks/messages';

const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
if (!NODEMAILER_USER || !NODEMAILER_USER)
  throw new Error('Missing Nodemailer user and/or password!');

/**
 * @description Send email with Ethereal mail service
 */
export async function Email(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult | void> {
  const eventBody = event.body ? JSON.parse(event.body) : event;
  const transaction = eventBody.transaction;

  const message = createMessage(transaction, eventBody);

  const mailTransport = createTransport(NODEMAILER_USER, NODEMAILER_PASS);

  // Attempt to send the email
  try {
    const mail = await mailTransport.sendMail(message);
    const previewUrl = nodemailer.getTestMessageUrl(mail);
    return {
      statusCode: 200,
      body: JSON.stringify(previewUrl)
    } as APIGatewayProxyResult;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    } as APIGatewayProxyResult;
  }
}
