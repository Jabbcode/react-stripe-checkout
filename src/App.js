import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

import axios from 'axios';

import "bootswatch/dist/lumen/bootstrap.min.css";
import './App.css';

const stripePromise = loadStripe('pk_test_51IVHDTB9dBQSSM8tuDnmA6niXc1IUGzFVqnB4Plk7F5u0wizZI4alAsmnAKiHcCWubNdaTqR7ZVpMEzmJlL8X4DQ009MRX1uAR');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });
    setLoading(true);

    if (!error) {
      console.log(paymentMethod)
      const { id } = paymentMethod;

      try {
        const { data } = await axios.post('http://localhost:3001/api/checkout', {
          id,
          amount: 80000 // Enviar en centavoss
        })

        console.log(data)
        elements.getElement(CardElement).clear();

      } catch (error) {
        console.log(error)
      }
      setLoading(false);

    }

  };

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <img src="https://key0.cc/images/preview/42579_b4648dce1ca63cd7a4a454ac97529113.png" alt="laptop" className='img-fluid' />

      <h3 className='text-center my-2'>Price: 800$</h3>

      <div className="form-group">
        <CardElement className="form-control" />
      </div>

      <button className="btn btn-primary" disabled={!stripe}>
        {loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : "Buy" }
      </button>
    </form>
  )
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className='contaoner p-4'>
        <div className='row'>
          <div className='col-md-4 offset-md-4'>
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
