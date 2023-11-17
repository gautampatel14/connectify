import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import React, { useState, useEffect } from 'react'
import { Verification } from '../../redux/actions/profileAction'

    const StripeButton = ({ buyButtonId,dispatch,product,token,auth }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleClick = async () => {
    
        dispatch(Verification({id:auth.user._id,token,product,auth}))

    };

    return (
        <div>
        <button onClick={handleClick}>
            Buy
        </button>
        {/* <CardElement /> */}
        </div>
    );
};

export default StripeButton;
