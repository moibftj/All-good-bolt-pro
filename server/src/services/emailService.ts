import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to Talk-to-My-Lawyer!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1976D2; margin-bottom: 10px;">Welcome to Talk-to-My-Lawyer!</h1>
            <p style="color: #666; font-size: 16px;">Professional Legal Document Generation Platform</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #F4B942 0%, #E85D75 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: white; margin: 0 0 15px 0;">Hello ${name}!</h2>
            <p style="color: white; margin: 0; font-size: 16px; line-height: 1.5;">
              Thank you for joining our platform. You can now generate professional legal documents 
              in minutes without expensive lawyer fees.
            </p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">What you can do:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Generate professional legal letters and documents</li>
              <li>Choose from attorney-reviewed templates</li>
              <li>Download documents in PDF format</li>
              <li>Manage your subscriptions and usage</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.CLIENT_URL}" 
               style="background: #1976D2; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;
                      font-weight: bold;">
              Get Started Now
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="color: #888; font-size: 14px; margin: 0;">
              Need help? Contact us at <a href="mailto:moizj00@gmail.com" style="color: #1976D2;">moizj00@gmail.com</a>
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, name: string, resetToken: string) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Password Reset Request - Talk-to-My-Lawyer',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1976D2; margin-bottom: 10px;">Password Reset Request</h1>
            <p style="color: #666; font-size: 16px;">Talk-to-My-Lawyer Platform</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; border-left: 5px solid #1976D2;">
            <h2 style="color: #333; margin: 0 0 15px 0;">Hello ${name},</h2>
            <p style="color: #666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
              We received a request to reset your password for your Talk-to-My-Lawyer account.
              If you didn't make this request, you can safely ignore this email.
            </p>
            <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.5;">
              To reset your password, click the button below. This link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${resetUrl}" 
               style="background: #1976D2; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;
                      font-weight: bold;">
              Reset My Password
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin-bottom: 30px;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Security Note:</strong> If you didn't request this password reset, 
              please contact our support team immediately at moizj00@gmail.com
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              This link will expire in 1 hour. If you can't click the button above, 
              copy and paste this URL into your browser:
            </p>
            <p style="color: #888; font-size: 12px; word-break: break-all; margin: 10px 0 0 0;">
              ${resetUrl}
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendCommissionNotification = async (
  employeeEmail: string, 
  employeeName: string, 
  commission: number,
  userEmail: string
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: employeeEmail,
      subject: 'New Commission Earned - Talk-to-My-Lawyer',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1976D2; margin-bottom: 10px;">Commission Earned!</h1>
            <p style="color: #666; font-size: 16px;">Talk-to-My-Lawyer Platform</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: white; margin: 0 0 15px 0;">Congratulations ${employeeName}!</h2>
            <p style="color: white; margin: 0 0 15px 0; font-size: 18px;">
              You've earned a commission of <strong>$${commission.toFixed(2)}</strong>
            </p>
            <p style="color: white; margin: 0; font-size: 16px;">
              A user (${userEmail}) subscribed using your discount code.
            </p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.CLIENT_URL}" 
               style="background: #1976D2; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;
                      font-weight: bold;">
              View Dashboard
            </a>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Commission notification email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending commission notification email:', error);
    throw error;
  }
};