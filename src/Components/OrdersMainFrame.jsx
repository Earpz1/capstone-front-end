import { SlButton } from '@shoelace-style/shoelace/dist/react'
import { getOrder } from '../fetches'
import OrderedItem from './OrderedItem'
import { Dropdown, Button } from 'react-bootstrap'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const OrdersMainFrame = (props) => {
  const queryClient = useQueryClient()

  const { data: currentOrder, isLoading: getCurrentOrder } = useQuery(
    ['currentOrder', props.orderID],
    ({ queryKey }) => getOrder(queryKey[1]),
    {
      delay: 1000,
      onSuccess: () => {
        console.log(currentOrder)
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

  const handleChange = (orderID, update) => {
    submitOrder({
      id: orderID,
      data: { orderStatus: update },
    })
  }

  const acceptOrder = (id) => {
    submitOrder({
      id: id,
      data: { orderStatus: 'Accepted' },
    })
  }

  return (
    <>
      {!getCurrentOrder ? (
        <div className="order-main-container w-75 mt-5">
          <div className="d-flex justify-content-evenly align-items-center">
            {currentOrder.orderStatus === 'Accepted' ||
            currentOrder.orderStatus === 'Out for Delivery' ? (
              <div className="d-flex align-items-center mr-3">
                <Dropdown>
                  <Dropdown.Toggle variant="secondary">
                    Status: {currentOrder.orderStatus}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleChange(currentOrder._id, 'Accepted')}
                    >
                      Accepted - In progress
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        handleChange(currentOrder._id, 'Out for Delivery')
                      }
                    >
                      Out for Delivery
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        handleChange(currentOrder._id, 'Delivered')
                      }
                    >
                      Delivered
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              ''
            )}

            {currentOrder.orderStatus === 'Pending' && (
              <div className="d-flex justify-content-between w-50">
                <Button
                  variant="success"
                  className="w-25"
                  onClick={() => acceptOrder(currentOrder._id)}
                >
                  Accept
                </Button>
                <Button variant="danger" className="w-25">
                  Reject
                </Button>
              </div>
            )}
          </div>
          <hr />
          <div className="d-flex flex-column">
            <div>
              <strong>Customer Name:</strong>{' '}
              {currentOrder.customerID.firstName}{' '}
              {currentOrder.customerID.lastName}
            </div>
            <div>
              <strong>Delivery Address: </strong>
              {currentOrder.customerID.address}
            </div>
            <div>
              <strong>Order Total: </strong>£{currentOrder.totalPrice}
            </div>
          </div>
          <div className="mt-5 d-flex flex-column align-items-center">
            <h2>Ordered Items</h2>
            {currentOrder.orderedItems.map((item) => (
              <OrderedItem item={item} />
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default OrdersMainFrame
