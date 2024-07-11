import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/users.models";

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "78709e9e523ed7",
      pass: "1cf7c830a146a1"
    }
  });

export const mailer = async ({email, emailType, userID}: any) => {
    const hashedToken = await bcrypt.hash(userID.toString(), 10);
    console.log(hashedToken)
    const updatedUser = await User.findByIdAndUpdate(userID, {
        $set:{
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000
        }
    });
    console.log(updatedUser)

    const verificationLink = `https://localhost:3000/verify?token=${hashedToken}&id=${userID}`;

    const mailInfo = {
        from: '"authentication" <no-reply@authapp>',
        to: email, 
        subject: emailType,
        text: `Please verify your account by clicking the following link: ${verificationLink}`,
        html: generateEmailHTML(verificationLink)
    };
    console.log("sending mail")
    await transporter.sendMail(mailInfo);
};

const generateEmailHTML = (verificationLink: string) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #444;">Welcome to Your App Name!</h2>
        <p>Thank you for registering. Please verify your account by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007BFF; border-radius: 5px; text-decoration: none;">
            Verify Your Account
        </a>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Thanks,<br/>The Your App Name Team</p>
    </div>
    `;
};
