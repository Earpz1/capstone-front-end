import React from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'

const CheckoutForm = () => {
  const navigate = useNavigate()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const orderID = searchParams.get('orderID')
  const stripe = useStripe()
  const elements = useElements()

  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/orderConfirmed?orderID=${orderID}`,
      },
    })

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message)
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" variant="danger">
        Process Payment
      </Button>
    </form>
  )
}

export default CheckoutForm
