import Navbar from './Layout/Navbar'
import { Container, Form, Button } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getUserDetails } from '../fetches'
import { useState, useEffect } from 'react'
import AccountSidebar from './Layout/AccountSidebar'
import { decodeToken } from 'react-jwt'
import { getOwnersRestaurant } from '../fetches'

const RestaurantDetails = () => {
  const queryClient = useQueryClient()

  const tokenData = decodeToken(localStorage.getItem('accessToken'))

  const { data: OwnerRestaurant, isLoading: OwnerRestaurantLoading } = useQuery(
    ['OwnerRestaurant'],
    getOwnersRestaurant,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { mutate: editRestaurant } = useMutation((postData) =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}restaurant/editDetails`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
      body: JSON.stringify(postData),
    }),
  )

  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantAddress, setrestaurantAddress] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [minimumOrder, setMinimumOrder] = useState('')
  const [deliveryFee, setDeliveryFee] = useState('')

  useEffect(() => {
    if (!OwnerRestaurantLoading) {
      setTimeout(() => {
        setRestaurantName(OwnerRestaurant.name)
        setrestaurantAddress(OwnerRestaurant.address)
        setCuisine(OwnerRestaurant.cuisine)
        setMinimumOrder(OwnerRestaurant.minimumOrder)
        setDeliveryFee(OwnerRestaurant.deliveryFee)
      }, 300)
    }
  }, [OwnerRestaurant])

  const handleRestaurantName = (event) => {
    setRestaurantName(event.target.value)
  }

  const handleRestaurantAddress = (event) => {
    setrestaurantAddress(event.target.value)
  }

  const handleCuisine = (event) => {
    setCuisine(event.target.value)
  }

  const handleMinimumOrder = (event) => {
    setMinimumOrder(event.target.value)
  }

  const handleDeliveryFee = (event) => {
    setDeliveryFee(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    editRestaurant({
      name: restaurantName,
      address: restaurantAddress,
      cuisine: cuisine,
      deliveryFee: deliveryFee,
      minimumOrder: minimumOrder,
    })
  }

  return (
    <>
      <Navbar />
      <Container className="d-flex">
        <AccountSidebar />
        <div className="account-content-container">
          <h1>Restaurant Details</h1>
          <span>View and edit the details of your restaurant here</span>
          <Form className="register-form mt-5 d-flex flex-column">
            <strong>Restaurant Name</strong>
            <Form.Control
              type="firstName"
              className="w-50 mb-4"
              onChange={(event) => handleRestaurantName(event)}
              value={!OwnerRestaurantLoading && restaurantName}
            />
            <strong>Address</strong>
            <Form.Control
              type="lastName"
              className="w-50 mb-4"
              onChange={(event) => handleRestaurantAddress(event)}
              value={restaurantAddress}
            />
            <strong>Cuisine</strong>
            <Form.Control
              type="email"
              className="w-50 mb-4"
              onChange={(event) => handleCuisine(event)}
              value={cuisine}
            />
            <strong>Delivery Fee</strong>
            <Form.Control
              type="fee"
              className="w-50 mb-4"
              onChange={(event) => handleDeliveryFee(event)}
              value={deliveryFee}
            />
            <strong>Minimum Order</strong>
            <Form.Control
              type="fee"
              className="w-50 mb-4"
              onChange={(event) => handleMinimumOrder(event)}
              value={minimumOrder}
            />
          </Form>
          <Button
            variant="danger"
            className="mt-5 mb-3 w-25"
            onClick={handleSubmit}
          >
            Save Details
          </Button>
        </div>
      </Container>
    </>
  )
}
export default RestaurantDetails
