import { Rating } from 'react-simple-star-rating'
import Navbar from './Layout/Navbar'
import { useQuery } from 'react-query'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import {
  getMenuForRestaurant,
  getFoodCategories,
  getRestaurantDetails,
  getMenuItemsFromCategory,
} from '../fetches'
import { TiDelete } from 'react-icons/ti'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import Footer from './Layout/Footer'

const Menu = () => {
  const navigate = useNavigate()
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const restaurant = searchParams.get('restaurant')

  const [order, setOrder] = useState([])
  const [orderTotal, setOrderTotal] = useState(0)
  const [Item, setCurrentItem] = useState([])

  const { data: fetchMenu, isLoading: fetchMenuLoading } = useQuery(
    ['menuItems', restaurant],
    ({ queryKey }) => getMenuForRestaurant(queryKey[1]),
    {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 59916,
    },
  )

  const {
    data: RestaurantDetails,
    isLoading: RestaurantDetailsLoading,
  } = useQuery(
    ['RestaurantDetails', restaurant],
    ({ queryKey }) => getRestaurantDetails(queryKey[1]),
    {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 59916,
    },
  )

  const adjustOrderTotal = (price) => {
    setOrderTotal(orderTotal + price)
  }

  const reduceOrderTotal = (price) => {
    setOrderTotal(orderTotal - price)
  }

  const addItemToOrder = (item) => {
    if (order.includes(item)) {
      const index = order.indexOf(item)
      order[index].quantity++
      setOrder([...order])
      adjustOrderTotal(item.price)
    } else {
      item.quantity = 1
      setOrder([...order, item])
      adjustOrderTotal(item.price)
    }
  }

  const removeFromOrder = (menuItem) => {
    if (order.includes(menuItem)) {
      const index = order.indexOf(menuItem)
      if (order[index].quantity > 1) {
        order[index].quantity--
        setOrder([...order])
        reduceOrderTotal(menuItem.price)
      } else {
        setOrder(order.filter((item) => item !== menuItem))
        reduceOrderTotal(menuItem.price)
      }
    }
  }

  function round(num) {
    if (!RestaurantDetailsLoading) {
      var m = Number((Math.abs(num) * 100).toPrecision(15))
      return (Math.round(m) / 100) * Math.sign(num)
    }
  }

  const { mutate: placeOrder } = useMutation(
    (postData) =>
      fetch(`${process.env.REACT_APP_BACKEND_URL}orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify(postData),
      }),
    {
      onSuccess: async (data) => {
        const response = await data.json()
        setOrder([])
        navigate(`/checkout?orderID=${response._id}`)
      },
    },
  )

  const handleOrder = () => {
    placeOrder({
      restaurantID: restaurant,
      orderedItems: order,
      orderStatus: 'Awaiting Payment',
      deliveryFee: RestaurantDetails.deliveryFee,
    })
  }

  return (
    <>
      <Navbar />

      <Container className="d-flex flex-column justify-content-between mt-5">
        <div className="menuHeader justify-content-center w-100">
          <div className="top-menu-banner mt-5 d-flex">
            <img
              src="pizza1.png"
              className="search-card-image"
              width="200px"
              height="150px"
            />
            <div className="d-flex flex-column align-items-center w-75">
              <h1 className="mt-1">
                {!RestaurantDetailsLoading && RestaurantDetails.name}
              </h1>
              <div className="d-flex justify-content-between w-50">
                <p>{!RestaurantDetailsLoading && RestaurantDetails.cuisine}</p>
                <div className="d-flex">
                  <Rating size={30} readonly={true} initialValue="5" />
                </div>
              </div>
              <div className="d-flex justify-content-between w-50">
                <p>Minimum Order: £15</p>
                <p>Delivery: 50-60 Mins</p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-5">
          <div className="category-container w-25">
            <h1>Categories</h1>
            <ul>
              {!RestaurantDetailsLoading &&
                RestaurantDetails.foodCategories.map((category) => (
                  <a href={'#' + category}>
                    <li>{category}</li>
                  </a>
                ))}
            </ul>
          </div>

          <div className="d-flex flex-column align-items-center w-100">
            {!RestaurantDetailsLoading &&
              !fetchMenuLoading &&
              RestaurantDetails.foodCategories.map((CurrentCategory) => {
                const itemsInCategory = fetchMenu.filter(
                  (item) => item.category === CurrentCategory,
                )
                return (
                  <>
                    <h1 id={CurrentCategory}>{CurrentCategory}</h1>
                    {itemsInCategory.map((item) => (
                      <>
                        <div
                          className="menu-item-card d-flex justify-content-center w-75"
                          onClick={() => addItemToOrder(item)}
                        >
                          <div className="d-flex justify-content-between w-75 mt-3">
                            <p>{item.name}</p> <strong>{item.price}</strong>
                          </div>
                        </div>
                      </>
                    ))}
                  </>
                )
              })}
          </div>
          {order.length !== 0 && (
            <div className="order-slip d-flex flex-column align-items-center w-50">
              <h1>Your Order</h1>
              <ul>
                {order.map((item) => (
                  <>
                    <li>
                      {item.quantity} x {item.name}{' '}
                      <TiDelete onClick={() => removeFromOrder(item)} />
                    </li>
                  </>
                ))}
              </ul>
              <div className="d-flex flex-column">
                <p>
                  Delivery Fee:{' '}
                  {!RestaurantDetailsLoading &&
                    '£' + RestaurantDetails.deliveryFee}
                </p>
                <p>
                  Order Total: £
                  {round(orderTotal + RestaurantDetails.deliveryFee)}{' '}
                </p>
              </div>
              {!RestaurantDetailsLoading &&
                localStorage.getItem('accessToken') &&
                orderTotal > RestaurantDetails.minimumOrder && (
                  <Button variant="danger mt-2 mb-3" onClick={handleOrder}>
                    Place Order
                  </Button>
                )}
              {!RestaurantDetailsLoading &&
                localStorage.getItem('accessToken') &&
                orderTotal < RestaurantDetails.minimumOrder && (
                  <Button variant="danger mt-2 mb-3" onClick={handleOrder}>
                    £{round(RestaurantDetails.minimumOrder - orderTotal)} for
                    Delivery
                  </Button>
                )}
              {!localStorage.getItem('accessToken') && (
                <Button
                  variant="danger mt-2 mb-3"
                  onClick={() => navigate('/login')}
                >
                  Login to place order
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

export default Menu
