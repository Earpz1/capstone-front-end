import { useQuery } from 'react-query'
import { getPendingOrders } from '../fetches'
import { useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const PendingOrder = () => {
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const restaurant = searchParams.get('restaurantID')

  const { data: pendingOrders, isLoading: pendingOrdersLoaded } = useQuery(
    ['getPendingOrders', restaurant],
    ({ queryKey }) => getPendingOrders(queryKey[1]),
    {
      delay: 1000,
      onSuccess: () => {
        console.log(pendingOrders)
      },
    },
  )

  return (
    <>
      {' '}
      {!pendingOrdersLoaded &&
        pendingOrders.map((order) => {
          return (
            <>
              <div className="order-container">
                <div className="d-flex justify-content-between align-items-center">
                  <b>Order Number: {order._id} </b>
                  <div className="d-flex">
                    <Button variant="success" className="mr-5">
                      Accept
                    </Button>
                    <Button variant="danger" className="ml-2">
                      Reject
                    </Button>
                  </div>
                </div>
                <hr />
                {order.orderedItems.map((item) => (
                  <p>
                    {item.quantity} x {item.name}
                  </p>
                ))}
              </div>
            </>
          )
        })}
    </>
  )
}

export default PendingOrder
