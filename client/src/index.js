import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import DataProvider from './redux/store'
import StripeProvider from './components/StripeProvider';

// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_test_51Ns4h8SAkofUcsoWGLiwRy2LLBVSLDSyT95eEjAsqDsdklJIcnLm1iIJBMjkiB4PJXdDT6tX5edZn55x5wJfLFZs00S1mWZx36');

ReactDOM.render(
  <React.StrictMode>
    <DataProvider>
    <StripeProvider>
      <App />
    </StripeProvider>
    </DataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
