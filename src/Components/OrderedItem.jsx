import {
  SlCard,
  SlButton,
  SlCheckbox,
} from '@shoelace-style/shoelace/dist/react'
import { Card, Button } from 'react-bootstrap'
import { useState } from 'react'

const OrderedItem = ({ order, completeOrder }) => {
  return (
    <>
      <div className="d-flex flex-column w-75 align-items-center">
        <SlCard className="card-header mt-5 w-75">
          <div slot="header">
            <div className="d-flex align-items-center">
              <span>
                <strong>OrderID: </strong>
                {order._id}
              </span>
            </div>
          </div>
          {order.orderedItems.map((item) => (
            <Card className="w-100 d-flex mt-2">
              <Card.Body className="d-flex justify-content-between">
                {item.name}
              </Card.Body>
            </Card>
          ))}
        </SlCard>
      </div>
    </>
  )
}

export default OrderedItem
