import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { verifyUser } from '../../redux/actions/profileAction';

const PayButton = ({ auth}) => {

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleCheckout = async (auth) => {

        // Check if auth and auth.user are defined before accessing properties
        if (auth && auth.user && auth.user._id) {
            await dispatch(verifyUser({ id: auth.user._id, auth }));
        } else {
            console.error('Error: Unable to get user ID from auth.');
        }
    };

    return (
        <>
            <button onClick={() => handleCheckout(auth)}>checkout</button>
        </>
    );
};

export default PayButton;
