import Navbar from './Layout/Navbar'
import { Form, Button, Container, Spinner } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { getOrder } from '../fetches/index.js'
import { useEffect, useState } from 'react'

const Checkout = () => {
  const navigate = useNavigate()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const orderID = searchParams.get('orderID')

  const [paymentProcessing, setPaymentProcessing] = useState(false)

  const { data: orderData, isLoading: getOrderLoading } = useQuery(
    ['getCurrentOrder', orderID],
    ({ queryKey }) => getOrder(queryKey[1]),
  )

  const { mutate: processPayment } = useMutation(
    (postData) =>
      fetch(`http://localhost:3001/orders/updateOrder/${orderID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify(postData),
      }),
    {
      onSuccess: () => {
        console.log('Order has been paid for ')
      },
    },
  )

  const completePayment = () => {
    setPaymentProcessing(true)
    processPayment({
      orderStatus: 'Paid',
    })
    setTimeout(() => {
      navigate('/myDetails')
    }, 4000)
  }

  useEffect(() => {
    setTimeout(() => {
      console.log(orderData)
    }, 500)
  })

  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <div className="d-flex justify-content-center">
          <div className="order-slip d-flex flex-column align-items-center w-25">
            <h1>Your Order</h1>
            <ul>
              {!getOrderLoading &&
                orderData.orderedItems.map((item) => (
                  <>
                    <li>
                      {item.name} - {item.price} each{' '}
                    </li>
                  </>
                ))}
            </ul>
            Order Total: £{!getOrderLoading && orderData.totalPrice}
          </div>

          <div className="d-flex flex-column align-items-center w-50">
            {!paymentProcessing ? (
              <>
                <Form.Control
                  type="text"
                  placeholder="Name on Card"
                  className="w-50 mt-3 ml-5"
                />
                <Form.Control
                  type="text"
                  placeholder="Card Number"
                  className="w-50 mt-3 ml-5"
                />

                <Form.Control
                  type="text"
                  placeholder="Expiry Date"
                  className="w-50 mt-3 "
                />
                <Form.Control
                  type="text"
                  placeholder="Security Code"
                  className="w-50 mt-3 "
                />

                <Button
                  variant="success"
                  className="mt-2 w-50"
                  onClick={completePayment}
                >
                  Pay £{!getOrderLoading && orderData.totalPrice}
                </Button>
              </>
            ) : (
              <>
                <Spinner animation="border" role="status"></Spinner>
                <span>Payment Processing</span>
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}

export default Checkout
