const Razorpay = require("razorpay");

let instance;

if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET) {
    // Real Razorpay
    instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET
    });
} else {
    // Mock for dev/testing
    instance = {
        orders: {
            create: async (options) => ({
                id: "mock_order_123",
                currency: options.currency
            })
        }
    };
}

module.exports = { instance };


// const → declare constant.

// Razorpay → variable holding package constructor.

// require("razorpay") → load npm package.

// new Razorpay({...}) → create SDK instance with credentials.

// process.env.* → read env variables (secure).

// exports.instance = → make the instance available to other modules.