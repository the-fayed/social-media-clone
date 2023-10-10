import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST as string,
      port: parseInt(process.env.SERVICE_PORT as string),
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      }
    });
    await transporter.sendMail({
      from: `<Social Media Team`,
      to: to,
      subject: subject,
      html: html,
    });
    console.log(`Email has been sent to ${to}`);
  } catch (error) {
    console.log('Error while sending email', error);
  }
}