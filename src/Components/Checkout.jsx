import Navbar from './Layout/Navbar'
import { Form, Button, Container, Spinner } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { getOrder } from '../fetches/index.js'
import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import { clientKey } from '../fetches/index.js'
import axios from 'axios'
import Footer from './Layout/Footer'

const Checkout = () => {
  const stripePromise = loadStripe(
    'pk_test_51Mnjs0FvNVztANBA5pqqeENUQrSoZEfYpjCleha6u3ySMIMTkP7QIsSKtjYhZm1vyN2qo8jYDvhOI0O02OZ2GqFx00o3cooN26',
  )

  const navigate = useNavigate()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const orderID = searchParams.get('orderID')
  const [key, setKey] = useState('')

  const [paymentProcessing, setPaymentProcessing] = useState(false)

  const { data: orderData, isLoading: getOrderLoading } = useQuery(
    ['getCurrentOrder', orderID],
    ({ queryKey }) => getOrder(queryKey[1]),
  )

  const { mutate: processPayment } = useMutation(
    (postData) =>
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}orders/updateOrder/${orderID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
          body: JSON.stringify(postData),
        },
      ),
    {
      onSuccess: () => {
        console.log('Order has been paid for ')
      },
    },
  )

  const completePayment = () => {
    setPaymentProcessing(true)
    processPayment({
      orderStatus: 'pending',
    })
    setTimeout(() => {
      navigate('/myDetails')
    }, 4000)
  }

  const { data: getKey, isLoading: getKeyLoading } = useQuery(
    ['secretKey', orderID],
    ({ queryKey }) => clientKey(queryKey[1]),
    {
      onSuccess: (getKey) => {
        setKey(getKey)
      },
    },
  )

  const options = {
    clientSecret: key,
    appearance: {
      theme: 'night',
    },
  }

  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15))
    return (Math.round(m) / 100) * Math.sign(num)
  }

  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <div className="d-flex justify-content-center">
          <div className="order-slip d-flex flex-column align-items-center w-25">
            <h1>Your Order</h1>
            <ul>
              {!getOrderLoading &&
                orderData.orderedItems.map((item) => {
                  const itemPrice = item.quantity * item.price
                  return (
                    <>
                      <li>
                        {item.quantity} x {item.name} - £{itemPrice}{' '}
                      </li>
                    </>
                  )
                })}
            </ul>
            <div className="d-flex flex-column">
              <span>
                <small>
                  Items: {!getOrderLoading && '£' + orderData.totalPrice}
                </small>
              </span>
              <span>
                <small>
                  Delivery Fee:{' '}
                  {!getOrderLoading && '£' + orderData.deliveryFee}
                </small>
              </span>
              <span>
                <small>
                  Service Charge:{' '}
                  {!getOrderLoading && '£' + round(orderData.totalPrice * 0.05)}
                </small>
              </span>

              <p></p>
              <p>
                Order Total: £
                {!getOrderLoading &&
                  round(
                    orderData.totalPrice +
                      orderData.totalPrice * 0.05 +
                      orderData.deliveryFee,
                  )}
              </p>
            </div>
          </div>

          <div className="d-flex flex-column align-items-center w-50">
            {!getKeyLoading && (
              <div className="w-75">
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm
                    totalCost={round(
                      orderData.totalPrice +
                        orderData.totalPrice * 0.05 +
                        orderData.deliveryFee,
                    )}
                  />
                </Elements>
              </div>
            )}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  )
}

export default Checkout
