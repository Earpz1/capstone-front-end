import { useQuery, useMutation } from 'react-query'
import { getPendingOrders } from '../fetches'
import { useLocation } from 'react-router-dom'
import { Button, Container, Dropdown } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

const PendingSidebarOrder = () => {
  const queryClient = useQueryClient()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const restaurant = searchParams.get('restaurantID')

  const { data: pendingOrders, isLoading: pendingOrdersLoaded } = useQuery(
    ['getPendingOrders', restaurant],
    ({ queryKey }) => getPendingOrders(queryKey[1]),
  )

  const { mutate: submitOrder } = useMutation(
    (postData) =>
      fetch(`http://localhost:3001/orders/updateOrder/${postData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify(postData.data),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getPendingOrders')
      },
    },
  )

  //Function to convert a date object to just time in HH:MM format
  const convertTime = (date) => {
    const time = new Date(date)
    const hours = time.getHours()
    const minutes = time.getMinutes()
    return `${hours}:${minutes}`
  }

  return (
    <>
      <Container className="d-flex flex-column">
        {' '}
        {!pendingOrdersLoaded &&
          pendingOrders.map((order) => {
            return (
              <>
                <Link
                  className="no-link"
                  to={`?restaurantID=${restaurant}&orderID=${order._id}`}
                >
                  <div key={order._id} className="order-container mt-4">
                    <div className="d-flex flex-column justify-content-evenly align-items-center">
                      <h3 className="name">
                        {order.customerID.firstName} {order.customerID.lastName}
                      </h3>
                      {order.orderStatus !== 'pending' && (
                        <small>{order.orderStatus} </small>
                      )}
                    </div>
                    <hr />
                    <ul>
                      <li>
                        <b>Delivery to:</b> {order.customerID.address}
                      </li>
                      <li>
                        <b>Order total:</b> £{order.totalPrice}
                      </li>
                      <li>
                        <b>Order time: </b> {convertTime(order.createdAt)}
                      </li>
                    </ul>
                  </div>
                </Link>
              </>
            )
          })}
      </Container>
    </>
  )
}

export default PendingSidebarOrder
