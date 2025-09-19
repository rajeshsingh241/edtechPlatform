const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);

		console.log("Email sent successfully: ", mailResponse?.response||mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error.message||error);
		throw error;
	}
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;





// async function sendVerificationOTP(email, otp)
// → ye ek async function hai jo do cheez lega:

// email → jisko OTP bhejna hai

// otp → actual OTP number jo mail me bhejna hai

// const mailResponse = await mailSender(...)
// → yaha mailSender ek helper function hai jo tumhare transporter.sendMail() ko wrap karta hai.
// → basically ye function email bhejne ka kaam karega.
// → hum await use karte hain kyunki email bhejna ek asynchronous kaam hai (network request lagti hai).

// "Verification Email"
// → ye subject line hai jo email me dikhegi.

// emailTemplate(otp)
// → ek function hai jo OTP ko pretty HTML template me convert karega (jaise: “Your OTP is <b>123456</b>”).

// console.log("Email sent Successfully: ", mailResponse.response)
// → agar mail sahi gaya toh log karenge ki successful hai.

// catch(error) → agar beech me kuch problem aayi (jaise email ID galat hai ya server down hai) toh error log karenge aur throw karenge.








//  Ab tujhe har jagah sirf .save() karna hai, OTP mail apne aap bhej diya jaayega.
// Ye ek tarah ka automation / middleware layer hai.

//  pre("save") ka matlab

// pre = before (yaani pehle).

// "save" = Mongoose ka event. Jab bhi tu ek document save karega (jaise new OTP({...}).save()), usse pehle ye function chalega.

// Soch le ek guard khada hai gate pe →
// "Database me entry karne se pehle, tujhse ek extra kaam karwana hai."

//  Ye hook kyu use kiya?

// Automatic OTP email sending
// Tu chahta hai ki jaise hi OTP DB me save ho, user ke email pe OTP chala jaaye.
// Ab agar tu ye code har jagah manually likhega (har controller me sendVerificationOTP call karega), toh duplication ho jaayega.

//  Isliye, pre("save") hook use kiya.
// Matlab ab tu bas OTP ka object banake .save() karega → email automatically send ho jaayega.







// mailSender: tumhara custom helper (usually Nodemailer use karta hoga) jo email bhejta hai.

// emailTemplate: function jo OTP ke saath HTML/plain text email content bana deta hai.



// nodemailer ek npm library hai jo tumhe emails bhejne me help karta hai Node.js se.

// Jaise tum Gmail/Outlook se manually mail bhejte ho, wahi kaam nodemailer program ke through karta hai.

// Tum SMTP settings (server, username, password) dete ho aur ye mail bhej deta hai.

// Tumhare code me ek helper bana hoga mailSender.js jo internally nodemailer use karta hoga.