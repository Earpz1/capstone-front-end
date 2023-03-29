import {
  SlCard,
  SlButton,
  SlCheckbox,
} from '@shoelace-style/shoelace/dist/react'
import { getOrder } from '../fetches'
import OrderedItem from './OrderedItem'
import { Dropdown, Button } from 'react-bootstrap'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useState, useEffect } from 'react'

const OrdersMainFrame = (props) => {
  const [countCompleted, setCountCompleted] = useState(0)

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

  const addCompleted = () => {
    setCountCompleted(() => countCompleted + 1)
  }

  const minusCompleted = () => {
    setCountCompleted(() => countCompleted - 1)
  }

  return (
    <>
      {!getCurrentOrder && currentOrder.orderStatus === 'Accepted' && (
        <OrderedItem order={currentOrder} />
      )}
    </>
  )
}

export default OrdersMainFrame
