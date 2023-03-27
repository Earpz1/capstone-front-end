import { useQuery, useMutation } from 'react-query'
import { useLocation } from 'react-router-dom'
import { Button, Container, Dropdown } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { inProgressOrders } from '../fetches'

const InProgressSideBar = () => {
  const queryClient = useQueryClient()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const restaurant = searchParams.get('restaurantID')

  const { data: progressOrders, isLoading: inProgressLoaded } = useQuery(
    ['inProgress', restaurant],
    ({ queryKey }) => inProgressOrders(queryKey[1]),

    {
      onSuccess: (progressOrders) => {
        console.log(progressOrders)
      },
    },
  )

  const { mutate: submitOrder } = useMutation(
    (postData) =>
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}orders/updateOrder/${postData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
          body: JSON.stringify(postData.data),
        },
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries()
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
        {!inProgressLoaded &&
          progressOrders.map((order) => {
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

export default InProgressSideBar
