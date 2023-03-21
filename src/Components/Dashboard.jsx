import { Container } from 'react-bootstrap'
import Navbar from './Layout/Navbar'
import PendingSidebarOrder from './PendingSidebarOrder'
import OrdersMainFrame from './OrdersMainFrame'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import CompletedSidebarOrders from './CompletedSidebarOrders'

const Dashboard = () => {
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const orderID = searchParams.get('orderID')

  const [sidebar, setSidebar] = useState('')

  const handleSidebar = (change) => {
    setSidebar(change)
  }

  return (
    <>
      <Navbar />
      <Container fluid className="d-flex">
        <div className="d-flex flex-column w-25 pt-5 order-sidebar">
          <div className="d-flex">
            <div
              className="w-50 d-flex justify-content-center align-items-center pending-orders"
              onClick={() => handleSidebar('pending')}
            >
              Pending Orders
            </div>
            <div
              className="w-50 d-flex justify-content-center align-items-center completed-orders"
              onClick={() => handleSidebar('completed')}
            >
              Completed Orders
            </div>
          </div>
          {sidebar === 'pending' && <PendingSidebarOrder />}
          {sidebar === 'completed' && <CompletedSidebarOrders />}
        </div>
        <Container className="mt-5 d-flex justify-content-center w-100 order-mainframe">
          {orderID && <OrdersMainFrame orderID={orderID} />}
        </Container>
      </Container>
    </>
  )
}

export default Dashboard
