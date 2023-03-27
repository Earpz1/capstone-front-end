import { SlSplitPanel } from '@shoelace-style/shoelace/dist/react'
import { Container } from 'react-bootstrap'
import Navbar from './Layout/Navbar'
import PendingSidebarOrder from './PendingSidebarOrder'
import OrdersMainFrame from './OrdersMainFrame'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import CompletedSidebarOrders from './CompletedSidebarOrders'
import {
  SlTab,
  SlTabGroup,
  SlTabPanel,
} from '@shoelace-style/shoelace/dist/react'
import InProgressSideBar from './InProgressSideBar'
import { useQueryClient } from 'react-query'

const Dashboard = () => {
  const queryClient = useQueryClient()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const orderID = searchParams.get('orderID')

  const [sidebar, setSidebar] = useState('pending')
  const [pendingOrders, setPendingOrders] = useState(0)

  const countPendingOrders = (orders) => {
    setPendingOrders(orders)
  }

  const handleSidebar = (change) => {
    setSidebar(change)
  }

  return (
    <>
      <Navbar />
      <Container fluid className="w-100">
        <SlSplitPanel position="30">
          <div
            slot="start"
            style={{
              height: '88vh',
              background: 'var(--sl-color-neutral-50)',
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'center',
            }}
          >
            <SlTabGroup>
              <SlTab slot="nav" panel="general">
                Pending Orders ({pendingOrders})
              </SlTab>
              <SlTab slot="nav" panel="custom">
                In Progress
              </SlTab>
              <SlTab slot="nav" panel="advanced">
                Completed
              </SlTab>

              <SlTabPanel name="general">
                <PendingSidebarOrder count={countPendingOrders} />
              </SlTabPanel>
              <SlTabPanel name="custom">
                <InProgressSideBar />
              </SlTabPanel>
              <SlTabPanel name="advanced">
                <CompletedSidebarOrders />
              </SlTabPanel>
            </SlTabGroup>
          </div>
          <div
            slot="end"
            style={{
              height: '88vh',
              background: 'var(--sl-color-neutral-50)',
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'center',
            }}
          >
            {orderID && <OrdersMainFrame orderID={orderID} />}
          </div>
        </SlSplitPanel>
      </Container>
    </>
  )
}

export default Dashboard
