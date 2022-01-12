const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();

const stripe = new Stripe("sk_test_51IVHDTB9dBQSSM8tWRM7JntWhUPwjA5NxiVjkehuNqqi9CY2eLnsdVHWPx3pCQtWSmjRtneE72LUUdSrNvCeCq9s00QVhv10Cn")

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000'}));

app.post('/api/checkout', async (req, res) => {

    const { id, amount } = req.body;
    
    try {
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "USD",
            description: "Laptop",
            payment_method: id,
            confirm: true
        });
    
        console.log(payment)
    
        res.send({ message: 'Successfull payment'})
    } catch (error) {
        // console.log(error)
        res.json({ message: error.raw.message})
    }
})

app.listen(3001, () => {
    console.log('Server on port', 3001)
})