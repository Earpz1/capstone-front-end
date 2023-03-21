import { useQuery, useMutation } from 'react-query'
import { getCompletedOrders } from '../fetches'
import { useLocation } from 'react-router-dom'
import { Button, Container, Dropdown } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

const CompletedSidebarOrders = () => {
  const queryClient = useQueryClient()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const restaurant = searchParams.get('restaurantID')

  const { data: completedOrders, isLoading: pendingOrdersLoaded } = useQuery(
    ['completedOrders', restaurant],
    ({ queryKey }) => getCompletedOrders(queryKey[1]),
  )

  return (
    <>
      <Container className="d-flex flex-column">
        {' '}
        {!pendingOrdersLoaded &&
          completedOrders.map((order) => {
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
                        <b>Order time: </b> 19:34pm
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

export default CompletedSidebarOrders
