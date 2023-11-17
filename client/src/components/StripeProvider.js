// StripeProvider.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Ns4h8SAkofUcsoWGLiwRy2LLBVSLDSyT95eEjAsqDsdklJIcnLm1iIJBMjkiB4PJXdDT6tX5edZn55x5wJfLFZs00S1mWZx36');

const StripeProvider = ({ children }) => {
    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
};

export default StripeProvider;
