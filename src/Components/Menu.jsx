import { Rating } from 'react-simple-star-rating'
import Navbar from './Layout/Navbar'
import { useQuery } from 'react-query'
import { useState } from 'react'
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

  const { data: menuCategories, isLoading: menuCategoriesLoading } = useQuery(
    ['menuCategories'],
    getFoodCategories,
    {
      refetchOnWindowFocus: false,
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
    var m = Number((Math.abs(num) * 100).toPrecision(15))
    return (Math.round(m) / 100) * Math.sign(num)
  }

  const { mutate: placeOrder } = useMutation(
    (postData) =>
      fetch('http://localhost:3001/orders/create', {
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
      orderedItems: order,
      orderStatus: 'Awaiting Payment',
    })
  }
  return (
    <>
      <Navbar />

      <Container className="d-flex flex-column justify-content-between mt-5">
        <div className="menuHeader justify-content-center w-100">
          <div className="top-menu-banner mt-5 d-flex">
            <img
              src="https://picsum.photos/300/150"
              className="search-card-image"
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
              {!menuCategoriesLoading &&
                menuCategories.map((category) => (
                  <a href="#Desserts">
                    <li>{category}</li>
                  </a>
                ))}
            </ul>
          </div>

          <div className="d-flex flex-column align-items-center w-100">
            {!menuCategoriesLoading &&
              !fetchMenuLoading &&
              menuCategories.map((CurrentCategory) => {
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
                          <div className="d-flex justify-content-between w-25 mt-3">
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
              Order Total: £{round(orderTotal)}
              <Button variant="danger mt-2 mb-3" onClick={handleOrder}>
                Place Order
              </Button>
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

export default Menu
