// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
	{
		// Define the name field with type String, required, and trimmed
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		// Define the email field with type String, required, and trimmed
		email: {
			type: String,
			required: true,
			trim: true,
		},

		// Define the password field with type String and required
		password: {
			type: String,
			required: true,
		},
		// Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
		accountType: {
			type: String,
			enum: ["Admin", "Student", "Instructor"],
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
		approved: {
			type: Boolean,
			default: true,
		},
		additionalDetails: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Profile",
		},
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Course",
			},
		],
		token: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},
		image: {
			type: String,
			required: true,
		},
		courseProgress: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "courseProgress",
			},
		],

		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("user", userSchema);
// Exactly — ref ka matlab hota hai ki ye ID kiska hai (kis collection/model ka hai).

// Agar tum likho ref: "Profile" → matlab ye ObjectId Profile collection ka hai.

// Agar likho ref: "Course" → matlab ye ObjectId Course collection ka hai.

// Isse Mongoose ko ye samajh aata hai ki jab populate() karna ho, toh konsa collection check karna hai.
// MongoDB me har document ke paas ek unique _id hota hai.
// Ye _id ka type hota hai ObjectId (jaise 651f90a7bcf48b2f86a78b9d).
// Ye har document ki unique identity hoti hai.
// Jab hume ek document ko dusre document se link karna hota hai,
// toh hum pura document copy nahi karte.
// Bas uska _id (ObjectId) store karte hain.
// Ek collection hai Users

// Ek aur collection hai Profiles

// Har user ka ek profile hona chahiye

// Toh UserSchema me likhte hain:

// profile: {
//   type: mongoose.Schema.Types.ObjectId,  // yaha dusre document ka _id store hoga
//   ref: "Profile"                 

// Soch lo user ke paas sirf address (ObjectId) tha.
// populate() jaake us address se pura ghar ka data (profile) le aata hai.

// matlab findbyid se sirf _id milta hai
// populate se pura document milta hai uske andar ka data jaise age name eveything