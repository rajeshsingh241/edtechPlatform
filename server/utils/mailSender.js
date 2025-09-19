const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,                  
      port: process.env.MAIL_PORT,                  
      secure: process.env.MAIL_PORT == 465,         
      auth: {
        user: process.env.MAIL_USER,               
        pass: process.env.MAIL_PASS,               
      },
    });

    const info = await transporter.sendMail({
      from: `"StudyNotion || Rajesh" <${process.env.MAIL_USER}>`,
      to: email,       // recipient email (kisi bhi Gmail address)
      subject: title,
      html: body,
    });

    console.log("Mail sent:", info.response);
    return info;
  } catch (error) {
    console.log("Mail error:", error.message);
    throw error;
  }
};

module.exports = mailSender;

// Jab tum nodemailer se email bhejna chahte ho, toh tumhe ek connection banana padta hai mail service (jaise Gmail, Outlook, Yahoo, custom SMTP server, etc.) ke saath.

// Ye connection banane ke liye hum likhte hain:

// let transporter = nodemailer.createTransport({...});


//  Yaha transporter ek object hai jo tumhara email server se "connection pipeline" hota hai.
// Isko soch lo jaise delivery boy jo tumhara letter leke post office (Gmail/Outlook server) tak pohchaata hai.