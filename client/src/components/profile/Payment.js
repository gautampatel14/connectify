import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { verifyUser } from '../../redux/actions/profileAction';
import '../../styles/payment_form.css'; 

const PaymentForm = ({ auth, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({

        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: cardholderName,
        },
      });

      if (error) {
        throw new Error(error.message); // Throw an error if there's an issue with payment method creation
      }

      if (paymentMethod) {

        await dispatch(verifyUser({ id: auth.user._id, paymentMethodId: paymentMethod.id, auth }));
        // You might want to handle success, e.g., show a confirmation message or redirect the user
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error creating payment method:', error.message);
      // Handle errors as needed, e.g., show an error message to the user
      alert(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form-container">
      <div className="overlay"></div>
      <form onSubmit={handleSubmit} className="payment-form">
        <label>
          Amount: $999
        </label>

        <br />
        {/* Add an input for cardholder name */}
        <input
          type="text"
          placeholder="Cardholder Name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
        />
        {/* Include CardElement with options for cardholder name */}
        <CardElement
          options={{
            hidePostalCode: true,
            placeholder: 'Card details',
          }}
        />
        <div className="button-container">
          <button type="submit" disabled={loading}>
            Pay
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
