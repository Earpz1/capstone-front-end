import Navbar from './Layout/Navbar'
import { Container } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'

const ConfirmOrder = () => {
  const queryClient = useQueryClient()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const orderID = searchParams.get('orderID')

  const { mutate: submitOrder } = useMutation(
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
        queryClient.invalidateQueries('getPendingOrders')
      },
    },
  )

  useEffect(() => {
    submitOrder({
      orderStatus: 'Pending',
    })
  }, [])

  return (
    <>
      <Navbar />
      <Container className="d-flex justify-content-center">
        <div className="d-flex flex-column align-items-center mt-5">
          <img src="success.png" className="orderSuccess" />
          <h1> Thank you, your order has been sent to the restaurant!</h1>
          <h5>
            You can view the progress of your order in your "My orders" section
            of your account.{' '}
            <Link to="/MyOrders">Click here to head over there now!</Link>
          </h5>
        </div>
      </Container>
    </>
  )
}

export default ConfirmOrder
