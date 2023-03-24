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
        queryClient.invalidateQueries('getPendingOrders')
      },
    },
  )

  useEffect(() => {
    submitOrder({
      orderStatus: 'pending',
    })
  }, [])

  return (
    <>
      <Navbar />
      <Container className="d-flex justify-content-center">
        <div className="d-flex flex-column align-items-center mt-5">
          <img src="https://www.easy-gst.in/wp-content/uploads/2017/07/success-icon-10-300x300.png" />
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