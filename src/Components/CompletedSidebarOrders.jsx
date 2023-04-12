import { SlCard, SlButton } from '@shoelace-style/shoelace/dist/react'
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
          completedOrders.map((order) => {
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
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <span>
                        <strong>Delivery to: </strong>{' '}
                        {order.customerID.address}
                      </span>
                      <span>
                        <strong>Order Total: </strong>£{order.totalPrice}
                      </span>
                      <span>
                        <strong>Order Placed: </strong>{' '}
                        {convertTime(order.createdAt)}
                      </span>
                    </div>
                  </SlCard>{' '}
                </Link>
                <br />
              </>
            )
          })}
      </Container>
    </>
  )
}

export default CompletedSidebarOrders
