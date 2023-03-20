import { Container } from 'react-bootstrap'
import Navbar from './Layout/Navbar'
import PendingOrder from './PendingOrder'
import axios from 'axios'

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-between w-100 mt-1">
        <div className="w-50 d-flex justify-content-center align-items-center pending-orders">
          Pending Orders
        </div>
        <div className="w-50 d-flex justify-content-center align-items-center completed-orders">
          Completed Orders
        </div>
      </div>
      <Container className="d-flex justify-content-center mt-5">
        <PendingOrder />
      </Container>
    </>
  )
}

export default Dashboard
