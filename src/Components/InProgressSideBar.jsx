import { SlCard, SlButton } from '@shoelace-style/shoelace/dist/react'
import { useQuery, useMutation } from 'react-query'
import { useLocation } from 'react-router-dom'
import { Button, Container, Dropdown } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { inProgressOrders } from '../fetches'

const InProgressSideBar = (props) => {
  const queryClient = useQueryClient()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const restaurant = searchParams.get('restaurantID')

  const { data: progressOrders, isLoading: inProgressLoaded } = useQuery(
    ['inProgressOrders', restaurant],
    ({ queryKey }) => inProgressOrders(queryKey[1]),

    {
      onSuccess: (progressOrders) => {
        props.count(progressOrders.length)
      },
    },
  )

  const { mutate: submitProgressOrder } = useMutation(
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
        queryClient.invalidateQueries('inProgressOrders')
      },
    },
  )

  const completeOrder = (id) => {
    submitProgressOrder({
      id: id,
      data: { orderStatus: 'Delivered' },
    })
  }

  //Function to convert a date object to just time in HH:MM format
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
        {!inProgressLoaded && progressOrders.length === 0 && (
          <SlCard className="card-header">
            <div slot="header">
              <div className="d-flex justify-content-between align-items-center">
                <strong>No orders in progress </strong>
              </div>
            </div>
          </SlCard>
        )}
        {!inProgressLoaded &&
          progressOrders.map((order) => {
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
                        <Button
                          className="mt-2 w-50"
                          variant="success"
                          onClick={() => completeOrder(order._id)}
                        >
                          Complete Order
                        </Button>
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

export default InProgressSideBar
