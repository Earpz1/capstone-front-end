import { SlCard, SlButton } from '@shoelace-style/shoelace/dist/react'
import { useQuery, useMutation } from 'react-query'
import { getPendingOrders } from '../fetches'
import { useLocation } from 'react-router-dom'
import { Button, Container, Dropdown } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

const PendingSidebarOrder = (props) => {
  const queryClient = useQueryClient()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const restaurant = searchParams.get('restaurantID')

  const {
    data: pendingOrders,
    isLoading: pendingOrdersLoaded,
    refetch: getPending,
  } = useQuery(
    ['getPendingOrders', restaurant],
    ({ queryKey }) => getPendingOrders(queryKey[1]),

    {
      onSuccess: (pendingOrders) => {
        props.count(pendingOrders.length)
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

  const convertTime = (date) => {
    const time = new Date(date)
    const hours = time.getHours()
    const minutes = time.getMinutes()
    return `${hours}:${minutes}`
  }

  const css = `
  .card-header {
    min-width: 500px;
  }
  `

  return (
    <>
      <style>{css}</style>
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
                  <SlCard className="card-header">
                    <div slot="header">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>
                          {order.customerID.firstName}{' '}
                          {order.customerID.lastName}
                        </strong>
                        <div>
                          <SlButton slot="header" variant="success">
                            Accept
                          </SlButton>{' '}
                          <SlButton slot="header" variant="danger">
                            Decline
                          </SlButton>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <span>
                        <strong>Delivery to: </strong> {order.address}
                      </span>
                      <span>
                        <strong>Order Total: </strong>£{order.totalPrice}
                      </span>
                      <span>
                        <strong>Order Placed: </strong>{' '}
                        {convertTime(order.createdAt)}
                      </span>
                    </div>
                  </SlCard>
                </Link>
              </>
            )
          })}
      </Container>
    </>
  )
}

export default PendingSidebarOrder
