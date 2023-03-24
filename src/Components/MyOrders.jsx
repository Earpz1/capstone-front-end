import Navbar from './Layout/Navbar'
import { Container, Button } from 'react-bootstrap'
import { useQuery, useQueryClient } from 'react-query'
import { getUserDetails } from '../fetches'
import AccountSidebar from './Layout/AccountSidebar'
import { getMyOrders } from '../fetches'
import OrderedItem from './OrderedItem'
import { useState, useEffect } from 'react'
import Footer from './Layout/Footer'
import { useNavigate } from 'react-router-dom'

const MyAccount = () => {
  const navigate = useNavigate()
  const [showLimit, setShowLimit] = useState(3)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
    }
  })

  const loadMore = (event) => {
    event.preventDefault()
    const limit = showLimit
    setShowLimit(limit + 3)
  }

  const { data: myOrders, isLoading: myOrdersLoaded } = useQuery(
    ['customerOrders', showLimit],
    ({ queryKey }) => getMyOrders(queryKey[1]),
    {
      onSuccess: (myOrders) => {},
    },
  )

  //Write a function that Converts a date object into DD/MM/YYYY HH:MM format
  const convertDate = (date) => {
    const newDate = new Date(date)
    const day = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()
    const hours = newDate.getHours()
    const minutes = newDate.getMinutes()
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  return (
    <>
      <Navbar />
      <Container className="d-flex">
        <AccountSidebar />
        <div className="account-content-container">
          <h1>My Orders</h1>

          {!myOrdersLoaded &&
            myOrders.map((order) => (
              <>
                <div className="order-main-container w-100 mb-3">
                  <div className="d-flex justify-content-evenly align-items-center">
                    <b>{order.restaurantID.name}</b>
                  </div>
                  <hr />
                  <div className="d-flex flex-column">
                    <div>
                      <strong>Ordered:</strong> {convertDate(order.createdAt)}
                    </div>
                    <div>
                      <strong>Delivery Address: </strong>
                      {order.customerID.address}
                    </div>
                    <div>
                      <strong>Order Total: </strong>£{order.totalPrice}
                    </div>
                    <hr />
                    <ul>
                      {order.orderedItems.map((item) => (
                        <li>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ))}

          <Button className="w-100 mb-3" variant="danger" onClick={loadMore}>
            Load More
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  )
}
export default MyAccount
