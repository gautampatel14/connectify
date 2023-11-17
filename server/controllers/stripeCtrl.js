// stripeCtrl.js

const Users = require('../models/userModel')
const stripe = require('stripe')('sk_test_51Ns4h8SAkofUcsoWdrX999df90oavKcAk5UPuVAGLGmLy4OV0itBofwzibjaWR2hOkBOZRV3cBO7anxNXPEQxFHw00BMNswvCD');

const stripeCtrl = {

    createCheckoutSession: async (req, res) => {
        try {
        const { id } = req.params;

        // Get the user data
        const user = await Users.findById(id);
        
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Check if the user is already verified
        if (user.verified) return res.status(400).json({ msg: 'User is already verified' });

        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
            {
                price: 'price_1Ns54ZSAkofUcsoWWFhtnd34',
                quantity: 1,
            },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/${id}/success?session_id={CHECKOUT_SESSION_ID}`, // Update with your client URL
            cancel_url: process.env.CLIENT_URL, // Update with your client URL
        });

        res.json({ sessionId: session.id });
        } catch (err) {
        return res.status(500).json({ msg: err.message });
        }
    },

    verifyUser: async (req, res) => {
        try {
        const { id } = req.params;
        const { session_id } = req.body;

        // Retrieve the Checkout Session to verify the payment
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            // Update user model to mark as verified
            await Users.findByIdAndUpdate(id, { verified: true, transactionId: session.payment_intent });

            res.json({ msg: 'User successfully verified' });
        } else {
            res.status(400).json({ msg: 'Payment not successful' });
        }
        } catch (err) {
        return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = stripeCtrl;
