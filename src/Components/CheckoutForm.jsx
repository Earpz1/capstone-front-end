import React from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { getOrder } from '../fetches'
import { useQuery } from 'react-query'

const CheckoutForm = (props) => {
  const navigate = useNavigate()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const orderID = searchParams.get('orderID')
  const stripe = useStripe()
  const elements = useElements()
  const [paymentLoading, setPaymentLoading] = useState(false)

  const { data: currentOrder, isLoading: getCurrentOrder } = useQuery(
    ['currentOrder', orderID],
    ({ queryKey }) => getOrder(queryKey[1]),
  )

  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = async (event) => {
    setPaymentLoading(true)
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault()

    setTimeout(async () => {
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return
      }

      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: `/ConfirmOrder?orderID=${orderID}`,
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
      setPaymentLoading(false)
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {!getCurrentOrder && !paymentLoading && (
        <Button type="submit" variant="danger" className="mt-5 w-100">
          Pay £{props.totalCost}
        </Button>
      )}
      {paymentLoading && (
        <div className="d-flex justify-content-center">
          <Spinner className="mt-5" animation="border" role="status"></Spinner>
        </div>
      )}
    </form>
  )
}

export default CheckoutForm
